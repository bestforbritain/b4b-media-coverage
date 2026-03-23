export interface TrackConfig {
  id: string;
  displayName: string;
  shortName: string;
  colour: string;
  searchPhrases: string[];
  contextTerms: string[];
  excludeDomains: string[];
}

const COMMON_SOCIAL_EXCLUSIONS = [
  "bestforbritain.org",
  "x.com",
  "twitter.com",
  "facebook.com",
  "threads.net",
  "instagram.com",
  "bsky.app",
];

export const tracks: TrackConfig[] = [
  {
    id: "best-for-britain",
    displayName: "Best for Britain",
    shortName: "BfB",
    colour: "#1B3A6B",
    searchPhrases: ['"Best for Britain"'],
    contextTerms: [],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "uktbc",
    displayName: "UK Trade and Business Commission",
    shortName: "UKTBC",
    colour: "#2E7D32",
    searchPhrases: ['"UK Trade and Business Commission"'],
    contextTerms: [],
    excludeDomains: ["tradeandbusiness.uk", ...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "naomi-smith",
    displayName: "Naomi Smith",
    shortName: "Naomi Smith",
    colour: "#C62828",
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
    shortName: "Peter Norris",
    colour: "#6A1B9A",
    searchPhrases: ['"Peter Norris"'],
    contextTerms: ["Best for Britain", "Virgin Group"],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
  {
    id: "hilary-benn",
    displayName: "Hilary Benn",
    shortName: "Hilary Benn",
    colour: "#E65100",
    searchPhrases: ['"Hilary Benn"'],
    contextTerms: ["Best for Britain", "Trade and Business Commission"],
    excludeDomains: [...COMMON_SOCIAL_EXCLUSIONS],
  },
];

export function getTrackById(id: string): TrackConfig | undefined {
  return tracks.find((t) => t.id === id);
}
