import { StatCard } from "@/components/StatCard";
import { TimelineChart } from "@/components/TimelineChart";
import { OutletBarChart } from "@/components/OutletBarChart";
import { ArticleFeed } from "@/components/ArticleFeed";
import {
  getAllArticles,
  getTotalCount,
  getCountLast30Days,
  getTrackCounts,
  getWeeklyTimeline,
  getTopOutlets,
} from "@/lib/data";
import { tracks } from "@/config/tracks";

export default function Home() {
  const articles = getAllArticles();
  const totalCount = getTotalCount();
  const last30Days = getCountLast30Days();
  const trackCounts = getTrackCounts();
  const timeline = getWeeklyTimeline();
  const topOutlets = getTopOutlets(10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero stats */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Media Coverage Overview
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Coverage"
            value={totalCount}
            sublabel="All time"
          />
          <StatCard
            label="Last 30 Days"
            value={last30Days}
            sublabel="Recent coverage"
          />
          {tracks.slice(0, 2).map((track) => (
            <StatCard
              key={track.id}
              label={track.shortName}
              value={trackCounts[track.id] || 0}
              sublabel="Total articles"
            />
          ))}
        </div>
      </div>

      {/* Track breakdown */}
      <div className="mb-8">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {tracks.map((track) => (
            <a
              key={track.id}
              href={`/track/${track.id}`}
              className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:shadow-md transition-shadow"
            >
              <div
                className="text-2xl font-bold"
                style={{ color: track.colour }}
              >
                {trackCounts[track.id] || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {track.shortName}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Timeline chart */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Coverage Over Time
        </h2>
        <TimelineChart data={timeline} />
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent articles */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Coverage
          </h2>
          <ArticleFeed articles={articles} />
        </div>

        {/* Top outlets */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Outlets
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <OutletBarChart data={topOutlets} />
          </div>
        </div>
      </div>
    </div>
  );
}
