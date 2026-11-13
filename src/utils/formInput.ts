/** Mantém só dígitos (CPF, CNPJ, telefone, etc.). */
export function digitsOnly(value: string, maxLength?: number) {
  const digits = value.replace(/\D/g, "");
  if (maxLength !== undefined) {
    return digits.slice(0, maxLength);
  }
  return digits;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function getEmailFormatError(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Informe seu e-mail.";
  if (!EMAIL_REGEX.test(trimmed)) return "E-mail inválido.";
  return null;
}
