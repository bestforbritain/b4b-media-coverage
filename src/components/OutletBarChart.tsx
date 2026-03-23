"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OutletData {
  name: string;
  domain: string;
  count: number;
}

export function OutletBarChart({ data }: { data: OutletData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(300, data.length * 32)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, bottom: 5, left: 120 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#999" }} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12, fill: "#666" }}
          width={110}
        />
        <Tooltip />
        <Bar
          dataKey="count"
          fill="#1B3A6B"
          radius={[0, 4, 4, 0]}
          name="Articles"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
