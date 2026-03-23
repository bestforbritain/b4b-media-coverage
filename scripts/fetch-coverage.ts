import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// Types
interface Article {
  id: string;
  track: string;
  title: string;
  url: string;
  source_name: string;
  source_domain: string;
  published_at: string;
  first_seen_at: string;
  snippet: string;
  thumbnail_url: string;
  data_source: "google_cse" | "google_rss";
}

interface PollLogEntry {
  track: string;
  polled_at: string;
  source: "google_cse" | "google_rss";
  results: number;
  status: "ok" | "error" | "rate_limited";
}

interface TrackConfig {
  id: string;
  displayName: string;
  searchPhrases: string[];
  contextTerms: string[];
  excludeDomains: string[];
}

// Track configuration (duplicated from config/tracks.ts for standalone script use)
const COMMON_SOCIAL_EXCLUSIONS = [
  "bestforbritain.org",
  "x.com",
  "twitter.com",
  "facebook.com",
  "threads.net",
  "instagram.com",
  "bsky.app",
];

const tracks: TrackConfig[] = [
  {
    id: "best-for-britain",
    displayName: "Best for Britain",
    searchPhrases: ['"Best for Britain"'],
    contextTerms: [],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "uktbc",
    displayName: "UK Trade and Business Commission",
    searchPhrases: ['"UK Trade and Business Commission"'],
    contextTerms: [],
    excludeDomains: ["tradeandbusiness.uk", ...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "naomi-smith",
    displayName: "Naomi Smith",
    searchPhrases: ['"Naomi Smith"'],
    contextTerms: [
      "Best for Britain",
      "Trade and Business Commission",
      "Brexit",
      "EU",
    ],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "peter-norris",
    displayName: "Peter Norris",
    searchPhrases: ['"Peter Norris"'],
    contextTerms: ["Best for Britain", "Virgin Group"],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "hilary-benn",
    displayName: "Hilary Benn",
    searchPhrases: ['"Hilary Benn"'],
    contextTerms: ["Best for Britain", "Trade and Business Commission"],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
];

// Paths
const DATA_DIR = path.join(__dirname, "..", "data");
const ARTICLES_PATH = path.join(DATA_DIR, "articles.json");
const POLL_LOG_PATH = path.join(DATA_DIR, "poll-log.json");

// Environment
const CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
const CSE_ID = process.env.GOOGLE_CSE_ID;

function normaliseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    let hostname = parsed.hostname.replace(/^www\./, "");
    let pathname = parsed.pathname.replace(/\/+$/, "");
    return `${hostname}${pathname}`.toLowerCase();
  } catch {
    return url.toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
}

function makeArticleId(url: string): string {
  const normalised = normaliseUrl(url);
  return crypto.createHash("md5").update(normalised).digest("hex");
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function normaliseTitleForComparison(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCseQuery(track: TrackConfig): string {
  let query = track.searchPhrases.join(" ");

  if (track.contextTerms.length > 0) {
    const contextPart = track.contextTerms
      .map((t) => `"${t}"`)
      .join(" OR ");
    query += ` (${contextPart})`;
  }

  for (const domain of track.excludeDomains) {
    query += ` -site:${domain}`;
  }

  return query;
}

function buildRssUrl(track: TrackConfig): string {
  let query = track.searchPhrases.join("+");

  if (track.contextTerms.length > 0) {
    const contextPart = track.contextTerms
      .map((t) => `"${t}"`)
      .join("+OR+");
    query += `+(${contextPart})`;
  }

  for (const domain of track.excludeDomains) {
    query += `+-site:${domain}`;
  }

  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-GB&gl=GB&ceid=GB:en`;
}

async function fetchFromCse(
  track: TrackConfig
): Promise<{ articles: Article[]; status: "ok" | "error" | "rate_limited" }> {
  if (!CSE_API_KEY || !CSE_ID) {
    console.warn("Google CSE credentials not set, skipping CSE fetch");
    return { articles: [], status: "error" };
  }

  const query = buildCseQuery(track);
  const allResults: Article[] = [];
  const now = new Date().toISOString();

  for (let startIndex = 1; startIndex <= 21; startIndex += 10) {
    const params = new URLSearchParams({
      key: CSE_API_KEY,
      cx: CSE_ID,
      q: query,
      searchType: "",
      sort: "date",
      num: "10",
      start: startIndex.toString(),
      gl: "gb",
      lr: "lang_en",
    });

    const url = `https://www.googleapis.com/customsearch/v1?${params}`;

    try {
      const response = await fetch(url);

      if (response.status === 429) {
        console.warn(`Rate limited on CSE for track ${track.id}`);
        return { articles: allResults, status: "rate_limited" };
      }

      if (!response.ok) {
        const text = await response.text();
        console.error(`CSE error for ${track.id}: ${response.status} ${text}`);
        return { articles: allResults, status: "error" };
      }

      const data = await response.json();
      const items = data.items || [];

      for (const item of items) {
        const article: Article = {
          id: makeArticleId(item.link),
          track: track.id,
          title: item.title || "",
          url: item.link,
          source_name: item.displayLink || extractDomain(item.link),
          source_domain: extractDomain(item.link),
          published_at: item.pagemap?.metatags?.[0]?.["article:published_time"] ||
            item.pagemap?.metatags?.[0]?.["og:updated_time"] ||
            item.snippet?.match(/\w+ \d+, \d{4}/)?.[0]
              ? new Date(item.snippet.match(/\w+ \d+, \d{4}/)[0]).toISOString()
              : now,
          first_seen_at: now,
          snippet: item.snippet || "",
          thumbnail_url:
            item.pagemap?.cse_thumbnail?.[0]?.src ||
            item.pagemap?.cse_image?.[0]?.src ||
            "",
          data_source: "google_cse",
        };
        allResults.push(article);
      }

      if (items.length < 10) break; // No more pages
    } catch (error) {
      console.error(`CSE fetch error for ${track.id}:`, error);
      return { articles: allResults, status: "error" };
    }
  }

  return { articles: allResults, status: "ok" };
}

async function fetchFromRss(
  track: TrackConfig
): Promise<{ articles: Article[]; status: "ok" | "error" }> {
  const rssUrl = buildRssUrl(track);
  const now = new Date().toISOString();

  try {
    const response = await fetch(rssUrl);
    if (!response.ok) {
      console.error(`RSS error for ${track.id}: ${response.status}`);
      return { articles: [], status: "error" };
    }

    const text = await response.text();
    const articles: Article[] = [];

    // Simple XML parsing for RSS items
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null) {
      const itemXml = match[1];

      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/);
      const sourceMatch = itemXml.match(/<source[^>]*url="([^"]*)"[^>]*>(.*?)<\/source>/);

      const title = titleMatch?.[1] || titleMatch?.[2] || "";
      const link = linkMatch?.[1] || "";
      const pubDate = pubDateMatch?.[1] || "";
      const description = descMatch?.[1] || descMatch?.[2] || "";
      const sourceName = sourceMatch?.[2] || "";
      const sourceUrl = sourceMatch?.[1] || "";

      if (!link) continue;

      // Google News RSS links redirect — try to extract the real URL
      const realUrl = link.includes("news.google.com")
        ? link
        : link;

      articles.push({
        id: makeArticleId(realUrl),
        track: track.id,
        title: title.replace(/<[^>]*>/g, ""),
        url: realUrl,
        source_name: sourceName || extractDomain(sourceUrl || realUrl),
        source_domain: extractDomain(sourceUrl || realUrl),
        published_at: pubDate ? new Date(pubDate).toISOString() : now,
        first_seen_at: now,
        snippet: description.replace(/<[^>]*>/g, "").substring(0, 300),
        thumbnail_url: "",
        data_source: "google_rss",
      });
    }

    return { articles, status: "ok" };
  } catch (error) {
    console.error(`RSS fetch error for ${track.id}:`, error);
    return { articles: [], status: "error" };
  }
}

function deduplicateArticles(
  existing: Article[],
  incoming: Article[]
): Article[] {
  const existingIds = new Set(existing.map((a) => a.id));
  const existingTitles = new Set(
    existing.map((a) => normaliseTitleForComparison(a.title))
  );

  const newArticles: Article[] = [];

  for (const article of incoming) {
    // Skip if URL already exists
    if (existingIds.has(article.id)) continue;

    // Skip if title is too similar to existing article
    const normTitle = normaliseTitleForComparison(article.title);
    if (normTitle.length > 10 && existingTitles.has(normTitle)) continue;

    existingIds.add(article.id);
    existingTitles.add(normTitle);
    newArticles.push(article);
  }

  return newArticles;
}

async function main() {
  console.log("Starting coverage fetch...");
  console.log(`Timestamp: ${new Date().toISOString()}`);

  // Load existing data
  let existingArticles: Article[] = [];
  let pollLog: PollLogEntry[] = [];

  try {
    existingArticles = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf-8"));
  } catch {
    console.log("No existing articles file, starting fresh");
  }

  try {
    pollLog = JSON.parse(fs.readFileSync(POLL_LOG_PATH, "utf-8"));
  } catch {
    console.log("No existing poll log, starting fresh");
  }

  const now = new Date().toISOString();
  let totalNew = 0;

  for (const track of tracks) {
    console.log(`\nFetching track: ${track.displayName}`);

    // Fetch from both sources
    const [cseResult, rssResult] = await Promise.all([
      fetchFromCse(track),
      fetchFromRss(track),
    ]);

    // Combine results from both sources
    const allIncoming = [...cseResult.articles, ...rssResult.articles];

    // Deduplicate against existing + within incoming
    const newArticles = deduplicateArticles(existingArticles, allIncoming);

    console.log(
      `  CSE: ${cseResult.articles.length} results (${cseResult.status})`
    );
    console.log(
      `  RSS: ${rssResult.articles.length} results (${rssResult.status})`
    );
    console.log(`  New unique articles: ${newArticles.length}`);

    existingArticles.push(...newArticles);
    totalNew += newArticles.length;

    // Log polls
    pollLog.push({
      track: track.id,
      polled_at: now,
      source: "google_cse",
      results: cseResult.articles.length,
      status: cseResult.status,
    });
    pollLog.push({
      track: track.id,
      polled_at: now,
      source: "google_rss",
      results: rssResult.articles.length,
      status: rssResult.status,
    });
  }

  // Sort articles by published_at descending
  existingArticles.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  // Write data
  fs.writeFileSync(ARTICLES_PATH, JSON.stringify(existingArticles, null, 2));
  fs.writeFileSync(POLL_LOG_PATH, JSON.stringify(pollLog, null, 2));

  console.log(`\nDone. Total new articles: ${totalNew}`);
  console.log(`Total articles in database: ${existingArticles.length}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
