// No "use client" needed here because ChartCard loads this with ssr:false
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

export default function RechartsBase({
  type,
  data,
  xKey,
  yKey,
}: {
  type: "line" | "bar";
  data: any[];
  xKey: string;
  yKey: string;
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" ? (
          <LineChart data={data}>
            <XAxis dataKey={xKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke="#7A0010" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <XAxis dataKey={xKey} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey={yKey} fill="#7A0010" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
