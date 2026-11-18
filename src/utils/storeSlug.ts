export function slugifyStoreName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function getStoreNameError(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Informe o nome da loja.";
  if (trimmed.length < 2) return "Use pelo menos 2 caracteres.";
  if (trimmed.length > 80) return "Máximo de 80 caracteres.";
  return null;
}

export function getStoreSlugError(slug: string): string | null {
  const trimmed = slug.trim();
  if (!trimmed) return "Informe o endereço da loja (slug).";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return "Use apenas letras minúsculas, números e hífens.";
  }
  if (trimmed.length < 3) return "Mínimo de 3 caracteres no slug.";
  return null;
}