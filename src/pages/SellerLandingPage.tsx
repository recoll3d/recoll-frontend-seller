import { Link } from "react-router-dom";
import { FaBoxOpen, FaShieldHalved, FaStore } from "react-icons/fa6";

import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";

const USER_APP_URL =
  import.meta.env.VITE_USER_APP_URL?.replace(/\/$/, "") ?? "https://re-coll.vercel.app";

const REASONS = [
  {
    icon: FaStore,
    title: "Sua vitrine na Recoll",
    text: "Publique produtos com aprovação da equipe — evitamos erros e anúncios inadequados antes de chegar ao comprador.",
  },
  {
    icon: FaBoxOpen,
    title: "Frete integrado ao marketplace",
    text: "Cotação no checkout e etiquetas pelo fluxo que já usamos hoje (Melhor Envio; Frenet quando a parceria fechar).",
  },
  {
    icon: FaShieldHalved,
    title: "Pagamento via Mercado Pago",
    text: "O comprador paga com Pix e cartão na loja Recoll; você acompanha pedidos no painel do vendedor.",
  },
];

export function SellerLandingPage() {
  return (
    <div className="min-h-full bg-canvas text-title">
      <SellerSiteHeader />

      <section className="relative overflow-hidden border-b border-edge/40 bg-seller-hero">
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/5 blur-2xl" />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="font-primary text-sm font-semibold uppercase tracking-widest text-accent">
              Programa de vendedores
            </p>
            <h1 className="mt-3 font-primary text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Venda no marketplace{" "}
              <span className="text-accent">Recoll</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-text">
              Cadastro guiado, etapa por etapa. Sem formulário gigante — você avança no seu ritmo e
              nossa equipe revisa antes de publicar.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-text">
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Conta PF ou empresa (CPF/CNPJ)
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Produtos visíveis só após aprovação
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Mesma qualidade de formulário do app Recoll
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register/terms" className="button button-accent min-h-12 px-10">
                Começar a vender
              </Link>
              <Link to="/login" className="button button-outline min-h-12 px-8">
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="surface-card border-edge/50 bg-surface/80 p-6 backdrop-blur sm:p-8">
            <p className="text-sm font-semibold text-accent">Como funciona</p>
            <ol className="mt-4 space-y-4 text-sm leading-6 text-text">
              <li>
                <span className="font-bold text-title">1.</span> Aceite os termos e escolha PF ou
                CNPJ.
              </li>
              <li>
                <span className="font-bold text-title">2.</span> Cadastre loja e endereço de envio.
              </li>
              <li>
                <span className="font-bold text-title">3.</span> Envie para análise da equipe Recoll.
              </li>
              <li>
                <span className="font-bold text-title">4.</span> Publique produtos (cada um também
                passa por aprovação).
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-canvas px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-primary text-3xl font-bold text-title">
            Por que vender com a Recoll?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-text sm:text-base">
            Inspiração nos fluxos da Amazon e do Mercado Livre, com a cara Recoll — verde, escuro e
            direto ao ponto.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="surface-card flex flex-col gap-3 border-edge/40 bg-surface p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="text-xl" aria-hidden />
                </span>
                <h3 className="font-primary text-xl font-bold text-title">{title}</h3>
                <p className="text-sm leading-6 text-text">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge/30 bg-[#0f1520] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-primary text-2xl font-bold">Pronto para o primeiro passo?</h2>
          <p className="mt-2 text-sm text-text">Leva poucos minutos para aceitar os termos e continuar.</p>
          <Link
            to="/register/terms"
            className="button button-accent mx-auto mt-6 inline-flex min-h-12"
          >
            Cadastre-se agora
          </Link>
        </div>
      </section>

      <footer className="border-t border-edge/30 px-4 py-8 text-center text-xs text-text sm:px-6">
        <p>
          Comprador? Acesse a{" "}
          <a
            href={USER_APP_URL}
            className="font-semibold text-accent hover:underline"
            rel="noopener noreferrer"
          >
            loja Recoll
          </a>
          .
        </p>
        <p className="mt-2 opacity-70">© {new Date().getFullYear()} Recoll</p>
      </footer>
    </div>
  );
}
