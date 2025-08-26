export const INSTITUTION_DOMAIN = "mseuf.edu.ph";

export function isInstitutionEmail(email: string) {
  const at = email.split("@")[1]?.toLowerCase().trim();
  return at === INSTITUTION_DOMAIN;
}

export function normalizePhone(ph: string) {
  const raw = ph.replace(/\D/g, "");
  if (raw.startsWith("09")) return "+63" + raw.slice(1);
  if (raw.startsWith("9") && raw.length === 10) return "+63" + raw;
  if (raw.startsWith("63")) return "+" + raw;
  if (ph.startsWith("+")) return ph;
  return ph;
}
