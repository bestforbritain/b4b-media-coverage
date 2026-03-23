import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

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

const outlets = [
  { name: "The Guardian", domain: "theguardian.com" },
  { name: "BBC News", domain: "bbc.co.uk" },
  { name: "The Independent", domain: "independent.co.uk" },
  { name: "Sky News", domain: "news.sky.com" },
  { name: "Financial Times", domain: "ft.com" },
  { name: "The Mirror", domain: "mirror.co.uk" },
  { name: "Evening Standard", domain: "standard.co.uk" },
  { name: "ITV News", domain: "itv.com" },
  { name: "The New Statesman", domain: "newstatesman.com" },
  { name: "Politics Home", domain: "politicshome.com" },
  { name: "HuffPost UK", domain: "huffingtonpost.co.uk" },
  { name: "The Times", domain: "thetimes.co.uk" },
  { name: "Channel 4 News", domain: "channel4.com" },
  { name: "LBC", domain: "lbc.co.uk" },
  { name: "City A.M.", domain: "cityam.com" },
  { name: "The Scotsman", domain: "scotsman.com" },
  { name: "Wales Online", domain: "walesonline.co.uk" },
  { name: "Manchester Evening News", domain: "manchestereveningnews.co.uk" },
  { name: "The Yorkshire Post", domain: "yorkshirepost.co.uk" },
  { name: "Belfast Telegraph", domain: "belfasttelegraph.co.uk" },
];

const bfbTitles = [
  "Best for Britain launches new campaign on EU relations",
  "Best for Britain poll reveals shifting public opinion on Brexit deal",
  "Campaign group Best for Britain calls for closer EU ties",
  "Best for Britain demands government rethink trade barriers",
  "Best for Britain report highlights economic cost of EU exit",
  "Best for Britain welcomes cross-party support for trade review",
  "New Best for Britain analysis shows impact on small businesses",
  "Best for Britain urges reset of UK-EU relationship",
  "Best for Britain survey: majority support single market access",
  "Best for Britain to host major conference on UK trade future",
  "Best for Britain challenges government position on customs checks",
  "Best for Britain coalition grows as new MPs sign up",
  "Best for Britain warns of Northern Ireland Protocol risks",
  "Trade experts back Best for Britain recommendations",
  "Best for Britain data shows regional impact of trade barriers",
];

const uktbcTitles = [
  "UK Trade and Business Commission publishes landmark report",
  "UK Trade and Business Commission calls for veterinary agreement",
  "Cross-party UK Trade and Business Commission warns on tariffs",
  "UK Trade and Business Commission hears evidence from exporters",
  "UK Trade and Business Commission recommends regulatory alignment",
  "UK Trade and Business Commission to investigate services trade",
  "Business leaders present to UK Trade and Business Commission",
  "UK Trade and Business Commission highlights touring artists crisis",
  "UK Trade and Business Commission report cited in Commons debate",
  "UK Trade and Business Commission seeks evidence on food standards",
];

const naomiSmithTitles = [
  "Best for Britain CEO Naomi Smith calls for pragmatic EU approach",
  "Naomi Smith: We must rebuild bridges with Europe",
  "Naomi Smith warns of growing trade friction post-Brexit",
  "Best for Britain's Naomi Smith addresses Labour conference",
  "Naomi Smith responds to government trade figures",
  "Naomi Smith op-ed: The case for a new EU relationship",
  "Naomi Smith debates Brexit legacy on BBC Question Time",
  "Best for Britain chief Naomi Smith meets EU ambassadors",
];

const peterNorrisTitles = [
  "Peter Norris: Business needs certainty on EU trade",
  "Virgin Group's Peter Norris backs closer EU ties",
  "Best for Britain chair Peter Norris calls for trade reset",
  "Peter Norris warns of investment uncertainty",
  "Peter Norris co-chairs trade commission hearing",
];

const hilaryBennTitles = [
  "Hilary Benn leads UK Trade and Business Commission inquiry",
  "Hilary Benn calls for pragmatic approach to EU relations",
  "Hilary Benn: Trade barriers hurting British exporters",
  "UK Trade and Business Commission co-chair Hilary Benn on trade deal",
];

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function generateArticles(): Article[] {
  const articles: Article[] = [];
  const now = new Date();
  const yearAgo = new Date(now);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  function addArticles(
    titles: string[],
    trackId: string,
    count: number
  ) {
    for (let i = 0; i < count; i++) {
      const title = titles[i % titles.length];
      const outlet = outlets[Math.floor(Math.random() * outlets.length)];
      const date = randomDate(yearAgo, now);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 50);
      const url = `https://${outlet.domain}/news/politics/${slug}-${Date.now() + i}`;
      const id = crypto.createHash("md5").update(url).digest("hex");

      articles.push({
        id,
        track: trackId,
        title: `${title}`,
        url,
        source_name: outlet.name,
        source_domain: outlet.domain,
        published_at: date.toISOString(),
        first_seen_at: new Date(
          date.getTime() + Math.random() * 6 * 60 * 60 * 1000
        ).toISOString(),
        snippet: `${title}. Coverage from ${outlet.name} discussing the latest developments in UK-EU relations and trade policy.`,
        thumbnail_url: "",
        data_source: Math.random() > 0.3 ? "google_cse" : "google_rss",
      });
    }
  }

  addArticles(bfbTitles, "best-for-britain", 85);
  addArticles(uktbcTitles, "uktbc", 35);
  addArticles(naomiSmithTitles, "naomi-smith", 25);
  addArticles(peterNorrisTitles, "peter-norris", 12);
  addArticles(hilaryBennTitles, "hilary-benn", 10);

  articles.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return articles;
}

const articles = generateArticles();
const dataDir = path.join(__dirname, "..", "data");
fs.writeFileSync(
  path.join(dataDir, "articles.json"),
  JSON.stringify(articles, null, 2)
);

console.log(`Seeded ${articles.length} sample articles`);
