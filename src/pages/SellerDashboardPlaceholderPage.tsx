import { useEffect, useState } from "react";

import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { useSellerAuth } from "../contexts/SellerAuthContext";
import { fetchSellerAccount, type SellerAccount } from "../services/sellerAccount";

type PanelSection = "home" | "store" | "products" | "orders";

const SECTIONS: { id: PanelSection; label: string; hint: string }[] = [
  { id: "home", label: "Início", hint: "Visão da loja" },
  { id: "store", label: "Sua loja", hint: "Nome e endereço" },
  { id: "products", label: "Produtos", hint: "Depois da aprovação" },
  { id: "orders", label: "Pedidos", hint: "Vendas da loja" },
];

const STATUS_LABEL: Record<string, string> = {
  pending_approval: "Aguardando aprovação",
  active: "Ativa",
  suspended: "Suspensa",
};

export function SellerDashboardPlaceholderPage() {
  const { session, signIn } = useSellerAuth();
  const [section, setSection] = useState<PanelSection>("home");
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
  const storeName = account?.storeName || "Sua loja";
  const storeSlug = account?.storeSlug;
  const email = account?.email || session?.email;

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:py-8">
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-64">
          <div className="surface-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Guia da loja</p>
            <p className="mt-2 text-sm text-text">Conta enviada. A análise da loja está em andamento.</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-body">
              <div className="progress-bar-fill h-full w-1/2" />
            </div>
            <nav className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {SECTIONS.map((item) => {
                const selected = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`rounded-[10px] px-3 py-2 text-left ${
                      selected ? "bg-accent/10 text-title" : "text-text hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block text-xs opacity-80">{item.hint}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {section === "home" ? (
            <HomeSection
              storeName={storeName}
              email={email}
              storeSlug={storeSlug}
              status={status}
              onOpenProducts={() => setSection("products")}
            />
          ) : null}
          {section === "store" ? (
            <StoreSection storeName={storeName} email={email} storeSlug={storeSlug} status={status} />
          ) : null}
          {section === "products" ? <ProductsSection pending={status !== "active"} /> : null}
          {section === "orders" ? <OrdersSection /> : null}
        </main>
      </div>
    </div>
  );
}

function HomeSection({
  storeName,
  email,
  storeSlug,
  status,
  onOpenProducts,
}: {
  storeName: string;
  email?: string;
  storeSlug?: string;
  status: string;
  onOpenProducts: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Painel</p>
        <h1 className="mt-2 font-primary text-3xl font-bold text-title sm:text-4xl">{storeName}</h1>
        <p className="mt-2 text-sm text-text sm:text-base">
          {email}
          {storeSlug ? ` · recoll.com.br/store/${storeSlug}` : ""}
        </p>
      </div>

      <section className="surface-card p-5 sm:p-6">
        <p className="text-sm font-semibold text-title">{STATUS_LABEL[status] ?? status}</p>
        <p className="mt-2 text-sm leading-6 text-text">
          {status === "pending_approval"
            ? "Recebemos o cadastro. A loja fica oculta para quem compra até a equipe concluir a análise."
            : status === "active"
              ? "A loja está ativa."
              : "Esta loja não pode publicar anúncios no momento."}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-primary text-xl font-bold text-title">O que esperar</h2>
          <ol className="mt-4 space-y-4">
            <Step n={1} title="Dados recebidos" done>
              Conta, nome da loja e endereço de envio já estão com a Recoll.
            </Step>
            <Step n={2} title="Análise da loja" current>
              A equipe confere o cadastro antes de liberar a vitrine.
            </Step>
            <Step n={3} title="Loja no ar">
              Com a aprovação, os anúncios podem aparecer para o comprador.
            </Step>
          </ol>
        </section>
        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-primary text-xl font-bold text-title">Enquanto a análise corre</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-text">
            <li>Separe fotos e a descrição do primeiro produto.</li>
            <li>O endereço público da loja já está reservado.</li>
            <li>Pedidos só entram depois que houver uma venda.</li>
          </ul>
          <button type="button" className="button button-accent mt-6" onClick={onOpenProducts}>
            Ver produtos
          </button>
        </section>
      </div>
    </div>
  );
}

function StoreSection({
  storeName,
  email,
  storeSlug,
  status,
}: {
  storeName: string;
  email?: string;
  storeSlug?: string;
  status: string;
}) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <h1 className="font-primary text-3xl font-bold text-title">Sua loja</h1>
      <dl className="mt-6 space-y-4 text-sm">
        <Info label="Nome público" value={storeName} />
        <Info label="Endereço" value={storeSlug ? `recoll.com.br/store/${storeSlug}` : "—"} />
        <Info label="E-mail da conta" value={email || "—"} />
        <Info label="Situação" value={STATUS_LABEL[status] ?? status} />
      </dl>
    </section>
  );
}

function ProductsSection({ pending }: { pending: boolean }) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <h1 className="font-primary text-3xl font-bold text-title">Produtos</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-text">
        {pending
          ? "O primeiro anúncio fica disponível quando a loja for aprovada. Até lá, nada é publicado para quem compra."
          : "Quando houver anúncios, eles aparecem nesta lista."}
      </p>
      <div className="mt-6 rounded-[12px] border border-dashed border-edge px-4 py-10 text-center text-sm text-text">
        Nenhum produto nesta loja.
      </div>
    </section>
  );
}

function OrdersSection() {
  return (
    <section className="surface-card p-5 sm:p-6">
      <h1 className="font-primary text-3xl font-bold text-title">Pedidos</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-text">
        As vendas da loja aparecem aqui, com o status de cada pedido.
      </p>
      <div className="mt-6 rounded-[12px] border border-dashed border-edge px-4 py-10 text-center text-sm text-text">
        Nenhum pedido ainda.
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  children,
  done,
  current,
}: {
  n: number;
  title: string;
  children: string;
  done?: boolean;
  current?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          done || current ? "bg-accent text-canvas" : "bg-body text-text"
        }`}
      >
        {n}
      </span>
      <div>
        <p className="text-sm font-semibold text-title">{title}</p>
        <p className="mt-1 text-sm leading-6 text-text">{children}</p>
      </div>
    </li>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-text">{label}</dt>
      <dd className="mt-1 font-semibold text-title">{value}</dd>
    </div>
  );
}
