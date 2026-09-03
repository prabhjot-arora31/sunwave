"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLOR, CHART_GRID, CHART_AXIS, CHART_TEXT } from "./chartTheme";

function formatDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const chartData = data.map((d) => ({ ...d, label: formatDay(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="leadsTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART_GRID} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: CHART_AXIS }}
          axisLine={{ stroke: CHART_GRID }}
          tickLine={false}
          interval={1}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: CHART_AXIS }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e1e0d9",
            fontSize: 12,
            color: CHART_TEXT,
          }}
          labelStyle={{ color: "#0b0b0b", fontWeight: 600 }}
          formatter={(value) => [value, "Leads"] as [number, string]}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke={CHART_COLOR}
          strokeWidth={2}
          fill="url(#leadsTrend)"
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
