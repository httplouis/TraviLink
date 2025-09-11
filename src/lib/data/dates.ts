// src/lib/dates.ts
export const pad2 = (n: number) => String(n).padStart(2, "0");

export function ymdhmLocal(isoLike: string) {
  const d = new Date(isoLike); // JS converts to local tz
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} `
       + `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
