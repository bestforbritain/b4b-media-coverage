import { tracks } from "@/config/tracks";

export const metadata = {
  title: "About — Best for Britain Media Coverage Tracker",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        About This Dashboard
      </h1>

      <div className="prose prose-gray max-w-none">
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            What This Tracks
          </h2>
          <p className="text-gray-600 mb-4">
            This dashboard automatically tracks media coverage of Best for
            Britain and its associated entities across UK and international
            news outlets. It replaces manual Google News searches with an
            automated, persistent, and visual system.
          </p>
          <p className="text-gray-600">
            Coverage is tracked across the following search terms:
          </p>
          <ul className="mt-3 space-y-2">
            {tracks.map((track) => (
              <li key={track.id} className="flex items-start gap-2">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: track.colour }}
                />
                <div>
                  <span className="font-medium text-gray-900">
                    {track.displayName}
                  </span>
                  {track.contextTerms.length > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      (with context: {track.contextTerms.join(", ")})
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Data Sources
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong>Google Custom Search API</strong> — Primary source. Searches
              the entire web with exact-phrase matching and site exclusions,
              filtered to news content.
            </li>
            <li>
              <strong>Google News RSS</strong> — Secondary/supplementary source.
              Provides additional coverage that the CSE API may miss, with no
              rate limits.
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Methodology
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong>Polling frequency:</strong> Data is refreshed every 6
              hours via automated scheduled jobs.
            </li>
            <li>
              <strong>Deduplication:</strong> Articles are deduplicated by
              normalised URL and title similarity to avoid counting the same
              story twice.
            </li>
            <li>
              <strong>Exclusions:</strong> Social media platforms and Best for
              Britain&apos;s own websites are excluded to focus on third-party
              media coverage only.
            </li>
            <li>
              <strong>Disambiguation:</strong> Common names (e.g. Naomi Smith)
              are disambiguated by requiring co-occurrence with relevant context
              terms like &ldquo;Best for Britain&rdquo; or &ldquo;Brexit&rdquo;.
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Limitations
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              Paywalled content (e.g. The Times, The Telegraph) may not be fully
              captured if Google does not index it.
            </li>
            <li>
              Historical coverage prior to the system&apos;s launch date may be
              incomplete, as Google&apos;s search API does not reliably return
              results older than approximately 30 days.
            </li>
            <li>
              Broadcast media (TV, radio) is not tracked unless accompanied by
              an online article.
            </li>
            <li>
              Social media mentions are not included in this version of the
              dashboard.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
