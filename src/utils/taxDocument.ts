import { digitsOnly } from "./formInput";

export function formatCpf(value: string) {
  const d = digitsOnly(value, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function formatCnpj(value: string) {
  const d = digitsOnly(value, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function cpfCheckDigits(d: string): boolean {
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * (10 - i);
  let mod = (sum * 10) % 11;
  if (mod === 10) mod = 0;
  if (mod !== Number(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(d[i]) * (11 - i);
  mod = (sum * 10) % 11;
  if (mod === 10) mod = 0;
  return mod === Number(d[10]);
}

function cnpjCheckDigits(d: string): boolean {
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(d[i]) * w1[i];
  let mod = sum % 11;
  const d1 = mod < 2 ? 0 : 11 - mod;
  if (d1 !== Number(d[12])) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(d[i]) * w2[i];
  mod = sum % 11;
  const d2 = mod < 2 ? 0 : 11 - mod;
  return d2 === Number(d[13]);
}

export function getTaxDocumentError(
  type: "individual" | "company",
  raw: string
): string | null {
  const d = digitsOnly(raw);
  if (!d) return type === "individual" ? "Informe seu CPF." : "Informe o CNPJ.";
  if (type === "individual") {
    if (d.length !== 11) return "CPF deve ter 11 dígitos.";
    if (!cpfCheckDigits(d)) return "CPF inválido.";
    return null;
  }
  if (d.length !== 14) return "CNPJ deve ter 14 dígitos.";
  if (!cnpjCheckDigits(d)) return "CNPJ inválido.";
  return null;
}