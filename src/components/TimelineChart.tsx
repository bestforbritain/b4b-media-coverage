"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { tracks } from "@/config/tracks";

interface TimelineData {
  week: string;
  total: number;
  [trackId: string]: number | string;
}

export function TimelineChart({
  data,
  showTracks = false,
}: {
  data: TimelineData[];
  showTracks?: boolean;
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available
      </div>
    );
  }

  const formatWeek = (week: string) => {
    const date = new Date(week);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="week"
          tickFormatter={formatWeek}
          tick={{ fontSize: 12, fill: "#999" }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#999" }}
          allowDecimals={false}
        />
        <Tooltip
          labelFormatter={(label) => {
            const date = new Date(label);
            return `Week of ${date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}`;
          }}
        />
        {showTracks ? (
          <>
            <Legend />
            {tracks.map((track) => (
              <Line
                key={track.id}
                type="monotone"
                dataKey={track.id}
                name={track.shortName}
                stroke={track.colour}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </>
        ) : (
          <Line
            type="monotone"
            dataKey="total"
            stroke="#1B3A6B"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
