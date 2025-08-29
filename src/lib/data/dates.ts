// src/lib/dates.ts
export function pad(n: number) { return String(n).padStart(2, "0"); }

export function todayLocalYMD() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// parse a 'YYYY-MM-DD' string as a LOCAL date (no timezone shift)
export function fromYMDLocal(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toYMDLocal(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
