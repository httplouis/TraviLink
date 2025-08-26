export const BRAND_MAROON = "#7A0010";

export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

type PasswordScore = 0 | 1 | 2 | 3;
type PasswordStrength = {
  score: PasswordScore;
  label: "weak" | "fair" | "medium" | "strong";
  hint?: string;
};

export function getPasswordStrength(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: "weak", hint: "Add a password." };

  let s = 0; // plain number while computing
  if (pw.length >= 8) s += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s += 1;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s += 1;

  const score = (s > 3 ? 3 : s) as PasswordScore; // narrow to 0|1|2|3
  const labels = ["weak", "fair", "medium", "strong"] as const;
  const label = labels[score];
  const hint = score < 3 ? "Use 8+ chars, mix upper/lower, numbers or symbols." : undefined;

  return { score, label, hint };
}
