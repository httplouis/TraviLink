export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-brand-cream text-brand-maroon px-2.5 py-0.5 text-xs font-medium">{children}</span>;
}
