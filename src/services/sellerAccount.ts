import type { SellerOnboardingDraft } from "../utils/sellerOnboardingStorage";

export type SellerAccount = {
  id: string;
  email: string;
  storeName: string;
  storeSlug: string;
  status: string;
};

export type SellerSessionPayload = {
  token: string;
  seller: SellerAccount;
};

function apiBase() {
  const base = import.meta.env.VITE_APP_API_URL?.trim().replace(/\/$/, "");
  if (!base) {
    throw new Error("API de vendedores não configurada.");
  }
  return base;
}

async function readError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    if (data.message) return data.message;
  } catch {
    // resposta sem JSON
  }
  return "Não foi possível concluir o cadastro.";
}

export async function registerSellerAccount(
  draft: SellerOnboardingDraft
): Promise<SellerSessionPayload> {
  const response = await fetch(`${apiBase()}/marketplace/seller-accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: draft.accountEmail,
      password: draft.accountPassword,
      businessType: draft.businessType,
      taxDocument: draft.taxDocument,
      country: draft.country,
      storeName: draft.storeName,
      storeSlug: draft.storeSlug,
      shipping: {
        postalCode: draft.shippingPostalCode,
        street: draft.shippingStreet,
        number: draft.shippingNumber,
        complement: draft.shippingComplement,
        neighborhood: draft.shippingNeighborhood,
        city: draft.shippingCity,
        state: draft.shippingState,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return (await response.json()) as SellerSessionPayload;
}

export async function loginSellerAccount(
  email: string,
  password: string
): Promise<SellerSessionPayload> {
  const response = await fetch(`${apiBase()}/marketplace/seller-accounts/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return (await response.json()) as SellerSessionPayload;
}

export async function fetchSellerAccount(token: string): Promise<SellerAccount> {
  const response = await fetch(`${apiBase()}/marketplace/seller-accounts/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const data = (await response.json()) as { seller: SellerAccount };
  return data.seller;
}
