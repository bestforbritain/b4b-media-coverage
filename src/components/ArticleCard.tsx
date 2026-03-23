import { Article } from "@/lib/types";
import { TrackBadge } from "./TrackBadge";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {article.thumbnail_url && (
          <img
            src={article.thumbnail_url}
            alt=""
            className="w-20 h-14 object-cover rounded flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TrackBadge trackId={article.track} />
            <span className="text-xs text-gray-500">
              {article.source_name}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(article.published_at)}
            </span>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bfb-blue hover:text-bfb-blue-light font-medium text-sm leading-snug line-clamp-2"
          >
            {article.title}
          </a>
          {article.snippet && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {article.snippet}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
