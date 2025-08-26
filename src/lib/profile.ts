export const BRAND_MAROON = "#7A0010";

export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function getPasswordStrength(
  pw: string
): { score: 0 | 1 | 2 | 3; label: "weak" | "fair" | "medium" | "strong"; hint?: string } {
  if (!pw) return { score: 0, label: "weak", hint: "Add a password." };
  let score: 0 | 1 | 2 | 3 = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const label = ["weak", "fair", "medium", "strong"][score] as "weak" | "fair" | "medium" | "strong";
  const hint = score < 3 ? "Use 8+ chars, mix upper/lower, numbers or symbols." : undefined;
  return { score, label, hint };
}
