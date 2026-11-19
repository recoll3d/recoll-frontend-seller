/** Percentual inteiro 0–100, sem zeros à esquerda. */
export function sanitizePercentInput(raw: string, max = 100) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const n = Math.min(max, Number(digits));
  if (!Number.isFinite(n)) return "";
  return String(n);
}

/** Exibição no campo: `10%` (valor numérico continua em sanitizePercentInput). */
export function formatPercentInputDisplay(raw: string) {
  const n = sanitizePercentInput(raw);
  return n === "" ? "" : `${n}%`;
}
