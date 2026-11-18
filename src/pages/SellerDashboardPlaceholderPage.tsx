import { useEffect, useState, type ReactNode } from "react";

import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { useSellerAuth } from "../contexts/SellerAuthContext";
import { fetchSellerAccount, type SellerAccount } from "../services/sellerAccount";

type PanelSection = "home" | "store" | "products" | "orders";

const SECTIONS: { id: PanelSection; label: string; icon: ReactNode }[] = [
  { id: "home", label: "Início", icon: <HomeIcon /> },
  { id: "store", label: "Loja", icon: <StoreIcon /> },
  { id: "products", label: "Produtos", icon: <BoxIcon /> },
  { id: "orders", label: "Pedidos", icon: <OrdersIcon /> },
];

const STATUS_LABEL: Record<string, string> = {
  pending_approval: "Aguardando aprovação",
  active: "No ar",
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
  const pending = status !== "active";

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas">
      <SellerSiteHeader />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-edge/70 lg:flex">
          <div className="px-5 pb-2 pt-6">
            <p className="truncate font-primary text-xl font-bold text-title">{storeName}</p>
            <p className="mt-1 text-xs text-text">{STATUS_LABEL[status] ?? status}</p>
          </div>
          <nav className="mt-4 flex flex-col px-3">
            {SECTIONS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                selected={section === item.id}
                onSelect={setSection}
              />
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-edge/70 px-2 lg:hidden">
            {SECTIONS.map((item) => {
              const selected = section === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => setSection(item.id)}
                  className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold ${
                    selected ? "border-accent text-title" : "border-transparent text-text"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
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
                <StoreSection
                  storeName={storeName}
                  email={email}
                  storeSlug={storeSlug}
                  status={status}
                />
              ) : null}
              {section === "products" ? <ProductsSection pending={pending} /> : null}
              {section === "orders" ? <OrdersSection /> : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  item,
  selected,
  onSelect,
}: {
  item: (typeof SECTIONS)[number];
  selected: boolean;
  onSelect: (id: PanelSection) => void;
}) {
  return (
    <button
      type="button"
      aria-current={selected ? "page" : undefined}
      onClick={() => onSelect(item.id)}
      className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-left text-sm font-semibold ${
        selected ? "border-accent text-title" : "border-transparent text-text hover:text-title"
      }`}
    >
      <span className={selected ? "text-accent" : "text-text"}>{item.icon}</span>
      {item.label}
    </button>
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
  const live = status === "active";
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-primary text-4xl font-bold leading-none text-title sm:text-5xl">
            {storeName}
          </h1>
          <p className="mt-3 text-sm text-text sm:text-base">
            {email}
            {storeSlug ? ` · recoll.com.br/store/${storeSlug}` : ""}
          </p>
        </div>
        <p className="text-sm font-semibold text-accent">{STATUS_LABEL[status] ?? status}</p>
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-6 text-text sm:text-base">
        {status === "pending_approval"
          ? "Recebemos o cadastro. A vitrine continua oculta para quem compra até a análise terminar."
          : live
            ? "A loja está no ar. Anúncios aprovados aparecem para quem compra."
            : "Esta loja não pode publicar anúncios no momento."}
      </p>

      <div className="mt-10 grid grid-cols-3 gap-4 border-y border-edge/70 py-6">
        <Metric value="0" label="Produtos" />
        <Metric value="0" label="Pedidos" />
        <Metric value={live ? "No ar" : "Oculta"} label="Vitrine" />
      </div>

      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        <Step title="Dados recebidos" done>
          Conta, nome da loja e endereço de envio já estão com a Recoll.
        </Step>
        <Step title="Análise da loja" current={!live}>
          A equipe confere o cadastro antes de liberar a vitrine.
        </Step>
        <Step title="Loja no ar" done={live}>
          Com a aprovação, os anúncios podem aparecer para o comprador.
        </Step>
      </ol>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-edge/70 pt-8">
        <p className="max-w-md text-sm leading-6 text-text">
          Separe fotos e a descrição do primeiro produto. A publicação abre depois da aprovação.
        </p>
        <button type="button" className="button button-accent" onClick={onOpenProducts}>
          Ver produtos
        </button>
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
    <div>
      <h1 className="font-primary text-4xl font-bold text-title">Loja</h1>
      <dl className="mt-8 divide-y divide-edge/70 border-y border-edge/70">
        <Info label="Nome público" value={storeName} />
        <Info label="Endereço" value={storeSlug ? `recoll.com.br/store/${storeSlug}` : "—"} />
        <Info label="E-mail da conta" value={email || "—"} />
        <Info label="Situação" value={STATUS_LABEL[status] ?? status} />
      </dl>
    </div>
  );
}

function ProductsSection({ pending }: { pending: boolean }) {
  return (
    <div>
      <h1 className="font-primary text-4xl font-bold text-title">Produtos</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-text sm:text-base">
        {pending
          ? "O primeiro anúncio fica disponível quando a loja for aprovada. Até lá, nada é publicado para quem compra."
          : "Quando houver anúncios, eles aparecem nesta lista."}
      </p>
      <EmptyState value="0" label="Nenhum produto nesta loja." />
    </div>
  );
}

function OrdersSection() {
  return (
    <div>
      <h1 className="font-primary text-4xl font-bold text-title">Pedidos</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-text sm:text-base">
        As vendas da loja aparecem aqui, com o status de cada pedido.
      </p>
      <EmptyState value="0" label="Nenhum pedido ainda." />
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-primary text-3xl font-bold text-title sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-text">{label}</p>
    </div>
  );
}

function Step({
  title,
  children,
  done,
  current,
}: {
  title: string;
  children: string;
  done?: boolean;
  current?: boolean;
}) {
  return (
    <li>
      <span
        className={`mb-4 block h-0.5 w-12 ${done || current ? "bg-accent" : "bg-edge"}`}
        aria-hidden
      />
      <p className="text-sm font-semibold text-title">{title}</p>
      <p className="mt-2 text-sm leading-6 text-text">{children}</p>
    </li>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <dt className="text-sm text-text">{label}</dt>
      <dd className="text-sm font-semibold text-title sm:text-right">{value}</dd>
    </div>
  );
}

function EmptyState({ value, label }: { value: string; label: string }) {
  return (
    <div className="mt-16">
      <p className="font-primary text-6xl font-bold text-title opacity-25">{value}</p>
      <p className="mt-3 text-sm text-text">{label}</p>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 9.5 6 4h12l2 5.5M4 9.5h16M4 9.5V20h16V9.5M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3.5 8 12 4l8.5 4L12 12 3.5 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3.5 8v8L12 20l8.5-4V8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 12v8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 7h13l-1.5 8.5h-10L6 4H3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" />
      <circle cx="17" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
