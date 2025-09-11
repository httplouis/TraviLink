export default function Chip({
  color="gray",
  children,
}: { color?: "green"|"yellow"|"red"|"gray"|"blue"; children: React.ReactNode }) {
  const map: Record<string,string> = {
    green: "bg-green-100 text-green-700",
    yellow:"bg-yellow-100 text-yellow-700",
    red:   "bg-rose-100 text-rose-700",
    blue:  "bg-blue-100 text-blue-700",
    gray:  "bg-slate-100 text-slate-700",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${map[color]}`}>{children}</span>;
}
