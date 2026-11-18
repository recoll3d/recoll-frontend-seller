import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { useSellerAuth } from "../contexts/SellerAuthContext";
import { fetchSellerAccount, type SellerAccount } from "../services/sellerAccount";

const STATUS_LABEL: Record<string, string> = {
  pending_approval: "Aguardando aprovação",
  active: "Ativa",
  suspended: "Suspensa",
};

export function SellerDashboardPlaceholderPage() {
  const { session, signIn } = useSellerAuth();
  const [account, setAccount] = useState<SellerAccount | null>(
    session
      ? {
          id: session.sellerId,
          email: session.email,
          storeName: session.storeName,
          storeSlug: session.storeSlug,
          status: session.status,
        }
      : null
  );

  useEffect(() => {
    if (!session?.token) return;
    let cancelled = false;
    void fetchSellerAccount(session.token)
      .then((seller) => {
        if (cancelled) return;
        setAccount(seller);
        signIn({
          token: session.token,
          email: seller.email,
          sellerId: seller.id,
          storeName: seller.storeName,
          storeSlug: seller.storeSlug,
          status: seller.status,
        });
      })
      .catch(() => {
        // Mantém os dados da sessão se a consulta falhar.
      });
    return () => {
      cancelled = true;
    };
  }, [session?.token, signIn]);

  const status = account?.status ?? "pending_approval";

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Painel</p>
        <h1 className="mt-2 font-primary text-3xl font-bold text-title">
          {account?.storeName || "Sua loja"}
        </h1>
        <p className="mt-2 text-text">
          {account?.email || session?.email}
          {account?.storeSlug ? ` · recoll.com.br/store/${account.storeSlug}` : ""}
        </p>
        <div className="surface-card mt-8 border-edge/40 bg-surface p-6">
          <p className="text-sm font-semibold text-title">{STATUS_LABEL[status] ?? status}</p>
          <p className="mt-2 text-sm text-text">
            {status === "pending_approval"
              ? "A loja ainda não aparece para quem compra. Os anúncios entram no ar depois da aprovação."
              : status === "active"
                ? "A loja está ativa."
                : "Esta loja não pode publicar anúncios no momento."}
          </p>
          <Link to="/" className="button button-outline mt-6 inline-flex">
            Voltar à landing
          </Link>
        </div>
      </main>
    </div>
  );
}
