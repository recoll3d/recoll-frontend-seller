import { Link } from "react-router-dom";

import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { useSellerAuth } from "../contexts/SellerAuthContext";

export function SellerDashboardPlaceholderPage() {
  const { session } = useSellerAuth();

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-primary text-3xl font-bold text-title">Painel do vendedor</h1>
        <p className="mt-2 text-text">
          Olá{session?.email ? `, ${session.email}` : ""}. Em breve: produtos, pedidos e configurações
          da loja.
        </p>
        <div className="surface-card mt-8 border-edge/40 bg-surface p-6">
          <p className="text-sm text-text">
            Produtos publicados só aparecem na loja após <strong className="text-title">aprovação</strong>{" "}
            — ver backlog.
          </p>
          <Link to="/" className="button button-outline mt-6 inline-flex">
            Voltar à landing
          </Link>
        </div>
      </main>
    </div>
  );
}
