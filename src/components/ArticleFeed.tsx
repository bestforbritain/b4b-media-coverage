"use client";

import { useState } from "react";
import { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { tracks } from "@/config/tracks";

export function ArticleFeed({ articles }: { articles: Article[] }) {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const filtered = activeTrack
    ? articles.filter((a) => a.track === activeTrack)
    : articles;

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            setActiveTrack(null);
            setVisibleCount(20);
          }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeTrack === null
              ? "bg-bfb-blue text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => {
              setActiveTrack(track.id);
              setVisibleCount(20);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTrack === track.id
                ? "text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={
              activeTrack === track.id
                ? { backgroundColor: track.colour }
                : undefined
            }
          >
            {track.shortName}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {visible.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          No articles found for this filter.
        </p>
      )}
    </div>
  );
}
