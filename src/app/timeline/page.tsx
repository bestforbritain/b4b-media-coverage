import { TimelineChart } from "@/components/TimelineChart";
import { getWeeklyTimeline, getAllArticles } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata = {
  title: "Coverage Timeline — Best for Britain",
};

export default function TimelinePage() {
  const timeline = getWeeklyTimeline();
  const articles = getAllArticles();

  // Group articles by month for browsing
  const byMonth: Record<string, typeof articles> = {};
  for (const article of articles) {
    const date = new Date(article.published_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(article);
  }

  const months = Object.keys(byMonth).sort().reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Coverage Timeline
      </h1>

      {/* All tracks chart */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Coverage by Track
        </h2>
        <TimelineChart data={timeline} showTracks />
      </section>

      {/* Total coverage chart */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Total Weekly Coverage
        </h2>
        <TimelineChart data={timeline} />
      </section>

      {/* Monthly breakdown */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Articles by Month
        </h2>
        {months.map((month) => {
          const date = new Date(month + "-01");
          const label = date.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          });
          const monthArticles = byMonth[month];

          return (
            <details key={month} className="mb-4">
              <summary className="cursor-pointer bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">{label}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({monthArticles.length} article
                  {monthArticles.length !== 1 ? "s" : ""})
                </span>
              </summary>
              <div className="mt-2 space-y-2 pl-4">
                {monthArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
