import { notFound } from "next/navigation";
import { tracks, getTrackById } from "@/config/tracks";
import { getArticlesByTrack, getTopOutlets } from "@/lib/data";
import { StatCard } from "@/components/StatCard";
import { OutletBarChart } from "@/components/OutletBarChart";
import { ArticleCard } from "@/components/ArticleCard";

export function generateStaticParams() {
  return tracks.map((track) => ({ slug: track.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = getTrackById(slug);
  if (!track) return {};
  return {
    title: `${track.displayName} Coverage — Best for Britain`,
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = getTrackById(slug);
  if (!track) notFound();

  const articles = getArticlesByTrack(track.id);
  const topOutlets = getTopOutlets(10, track.id);

  // Get last 30 days count
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const last30Days = articles.filter(
    (a) => new Date(a.published_at) >= cutoff
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: track.colour }}
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {track.displayName}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Coverage"
          value={articles.length}
          sublabel="All time"
        />
        <StatCard
          label="Last 30 Days"
          value={last30Days}
          sublabel="Recent coverage"
        />
        <StatCard
          label="Outlets"
          value={topOutlets.length}
          sublabel="Unique sources"
        />
      </div>

      {/* Top outlets for this track */}
      {topOutlets.length > 0 && (
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Outlets
          </h2>
          <OutletBarChart data={topOutlets} />
        </section>
      )}

      {/* All articles */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Coverage ({articles.length} articles)
        </h2>
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
