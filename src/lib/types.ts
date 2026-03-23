export interface Article {
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

export interface PollLogEntry {
  track: string;
  polled_at: string;
  source: "google_cse" | "google_rss";
  results: number;
  status: "ok" | "error" | "rate_limited";
}
