import { Article } from "./types";
import articlesData from "../../data/articles.json";
import { tracks } from "@/config/tracks";

const articles: Article[] = articlesData as Article[];

export function getAllArticles(): Article[] {
  return articles.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getArticlesByTrack(trackId: string): Article[] {
  return getAllArticles().filter((a) => a.track === trackId);
}

export function getRecentArticles(limit: number = 20): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getTotalCount(): number {
  return articles.length;
}

export function getCountLast30Days(): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return articles.filter((a) => new Date(a.published_at) >= cutoff).length;
}

export function getTrackCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const track of tracks) {
    counts[track.id] = articles.filter((a) => a.track === track.id).length;
  }
  return counts;
}

export function getWeeklyTimeline(): {
  week: string;
  total: number;
  [trackId: string]: number | string;
}[] {
  if (articles.length === 0) return [];

  const sorted = getAllArticles();
  const earliest = new Date(sorted[sorted.length - 1].published_at);
  const latest = new Date(sorted[0].published_at);

  const weeks: Map<
    string,
    { week: string; total: number; [key: string]: number | string }
  > = new Map();

  const current = new Date(earliest);
  current.setDate(current.getDate() - current.getDay() + 1); // Monday

  while (current <= latest) {
    const weekKey = current.toISOString().split("T")[0];
    const entry: { week: string; total: number; [key: string]: number | string } = {
      week: weekKey,
      total: 0,
    };
    for (const track of tracks) {
      entry[track.id] = 0;
    }
    weeks.set(weekKey, entry);
    current.setDate(current.getDate() + 7);
  }

  for (const article of sorted) {
    const date = new Date(article.published_at);
    date.setDate(date.getDate() - date.getDay() + 1);
    const weekKey = date.toISOString().split("T")[0];
    const entry = weeks.get(weekKey);
    if (entry) {
      entry.total = (entry.total as number) + 1;
      entry[article.track] = ((entry[article.track] as number) || 0) + 1;
    }
  }

  return Array.from(weeks.values());
}

export function getTopOutlets(
  limit: number = 15,
  trackId?: string
): { name: string; domain: string; count: number }[] {
  const filtered = trackId
    ? articles.filter((a) => a.track === trackId)
    : articles;

  const counts: Record<string, { name: string; domain: string; count: number }> = {};

  for (const article of filtered) {
    const key = article.source_domain || article.source_name;
    if (!counts[key]) {
      counts[key] = {
        name: article.source_name || article.source_domain,
        domain: article.source_domain,
        count: 0,
      };
    }
    counts[key].count++;
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getOutletArticles(): {
  name: string;
  domain: string;
  count: number;
  latestDate: string;
  articles: Article[];
}[] {
  const grouped: Record<
    string,
    {
      name: string;
      domain: string;
      count: number;
      latestDate: string;
      articles: Article[];
    }
  > = {};

  for (const article of getAllArticles()) {
    const key = article.source_domain || article.source_name;
    if (!grouped[key]) {
      grouped[key] = {
        name: article.source_name || article.source_domain,
        domain: article.source_domain,
        count: 0,
        latestDate: article.published_at,
        articles: [],
      };
    }
    grouped[key].count++;
    grouped[key].articles.push(article);
    if (article.published_at > grouped[key].latestDate) {
      grouped[key].latestDate = article.published_at;
    }
  }

  return Object.values(grouped).sort((a, b) => b.count - a.count);
}
