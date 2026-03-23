"use client";

import { useState } from "react";
import { Article } from "@/lib/types";
import { ArticleCard } from "@/components/ArticleCard";

interface OutletData {
  name: string;
  domain: string;
  count: number;
  latestDate: string;
  articles: Article[];
}

type SortField = "count" | "latestDate" | "name";

export function OutletTable({ outlets }: { outlets: OutletData[] }) {
  const [sortBy, setSortBy] = useState<SortField>("count");
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const sorted = [...outlets].sort((a, b) => {
    switch (sortBy) {
      case "count":
        return b.count - a.count;
      case "latestDate":
        return (
          new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-gray-100">
        <span className="text-sm text-gray-500">Sort by:</span>
        {(
          [
            ["count", "Total articles"],
            ["latestDate", "Most recent"],
            ["name", "Name"],
          ] as [SortField, string][]
        ).map(([field, label]) => (
          <button
            key={field}
            onClick={() => setSortBy(field)}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              sortBy === field
                ? "bg-bfb-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {sorted.map((outlet) => (
          <div key={outlet.domain}>
            <button
              onClick={() =>
                setExpandedDomain(
                  expandedDomain === outlet.domain ? null : outlet.domain
                )
              }
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${outlet.domain}&sz=32`}
                  alt=""
                  className="w-5 h-5 rounded"
                  loading="lazy"
                />
                <div>
                  <span className="font-medium text-gray-900">
                    {outlet.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {outlet.domain}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-sm font-semibold text-bfb-blue">
                    {outlet.count}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">
                    article{outlet.count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-xs text-gray-400 w-24 text-right">
                  {formatDate(outlet.latestDate)}
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedDomain === outlet.domain ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedDomain === outlet.domain && (
              <div className="bg-gray-50 px-4 py-3 space-y-2 border-t border-gray-100">
                {outlet.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
