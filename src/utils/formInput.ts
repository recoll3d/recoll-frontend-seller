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

const MIN_PASSWORD_LENGTH = 8;

export function getPasswordError(password: string): string | null {
  if (!password) return "Informe uma senha.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return null;
}

export function getPasswordConfirmError(password: string, confirm: string): string | null {
  if (!confirm) return "Confirme a senha.";
  if (password !== confirm) return "As senhas não coincidem.";
  return null;
}
