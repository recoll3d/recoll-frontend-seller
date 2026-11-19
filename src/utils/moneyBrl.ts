/** Interpreta valor digitado ou mascarado (R$ 84,99 / 84.99 / 84,99). */
export function parseMoneyBrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;

  const digitsOnly = trimmed.replace(/\D/g, "");
  if (/R\$|\s/.test(trimmed) || (digitsOnly.length >= 3 && !trimmed.includes(","))) {
    const cents = Number(digitsOnly || "0");
    if (Number.isFinite(cents)) return cents / 100;
  }

  if (trimmed.includes(",")) {
    const normalized = trimmed.replace(/[^\d,]/g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }

  const n = Number(trimmed.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatPriceMaskFromDigits(digits: string) {
  const cents = Number(digits.replace(/\D/g, "") || "0");
  const value = cents / 100;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatBrl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
