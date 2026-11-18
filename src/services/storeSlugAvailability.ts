export type StoreSlugAvailability = {
  available: boolean;
  suggestions: string[];
  /** API ainda sem a rota de unicidade — não bloqueia o cadastro. */
  unchecked?: boolean;
};

export async function checkStoreSlugAvailability(
  slug: string,
  signal?: AbortSignal
): Promise<StoreSlugAvailability> {
  const base = import.meta.env.VITE_APP_API_URL?.trim().replace(/\/$/, "");
  if (!base) {
    throw new Error("API de vendedores não configurada.");
  }

  const response = await fetch(
    `${base}/marketplace/store-slug/availability?slug=${encodeURIComponent(slug)}`,
    { signal }
  );
  if (response.status === 404) {
    return { available: true, suggestions: [], unchecked: true };
  }
  if (!response.ok) {
    throw new Error("Não foi possível verificar o endereço da loja.");
  }

  const data = (await response.json()) as Partial<StoreSlugAvailability>;
  return {
    available: Boolean(data.available),
    suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
  };
}