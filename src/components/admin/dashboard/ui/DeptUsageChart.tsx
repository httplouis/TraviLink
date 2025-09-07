"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#7A0019", "#9B2242", "#B8475F", "#D67887"];

export default function DeptUsageChart({ data }: { data: { dept: string; count: number }[] }) {
  return (
    <div className="tl-card p-4">
      <div className="text-sm font-medium mb-2">Department Usage</div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="dept"
              outerRadius="80%"
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
