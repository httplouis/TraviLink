"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type Props<T> = {
  title: string;
  type: "line" | "bar";
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
};

const Recharts = dynamic(() => import("./_Recharts"), { ssr: false });

export default function ChartCard<T>({ title, type, data, xKey, yKey }: Props<T>) {
  const d = useMemo(() => data, [data]);
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 text-sm font-medium">{title}</div>
      {/* renders nothing on server; safe for print as table fallback (optional) */}
      <Recharts type={type} data={d as any} xKey={xKey as string} yKey={yKey as string} />
    </div>
  );
}
