import { FaBoxOpen, FaShieldHalved, FaStore } from "react-icons/fa6";

import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";

const USER_APP_URL =
  import.meta.env.VITE_USER_APP_URL?.replace(/\/$/, "") ?? "https://re-coll.vercel.app";

const REASONS = [
  {
    icon: FaStore,
    title: "Vitrine profissional",
    text: "Organize sua marca, políticas e catálogo em um só lugar, com o mesmo padrão visual do marketplace Recoll.",
  },
  {
    icon: FaBoxOpen,
    title: "Envio para o comprador",
    text: "Informe de onde despacha: o comprador vê o frete no checkout e você emite a etiqueta pelo painel.",
  },
  {
    icon: FaShieldHalved,
    title: "Pagamentos centralizados",
    text: "Pix e cartão processados na loja Recoll, com acompanhamento dos seus pedidos no painel do vendedor.",
  },
];

export function SellerLandingPage() {
  return (
    <div className="min-h-full bg-canvas text-title">
      <SellerSiteHeader />

      <section className="relative overflow-hidden border-b border-edge/40 bg-seller-hero">
        <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/5 blur-2xl" />

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="font-primary text-sm font-semibold uppercase tracking-widest text-accent">
              Vendedores
            </p>
            <h1 className="mt-3 font-primary text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Leve seus produtos para quem já compra na{" "}
              <span className="text-accent">Recoll</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-text">
              Cadastre sua loja, envie seus anúncios e venda com suporte da nossa equipe. Cada etapa
              do cadastro é simples e objetiva.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SellerNavLink
                to="/register/terms"
                className="button button-accent min-h-12 px-10"
              >
                Começar a vender
              </SellerNavLink>
              <SellerNavLink to="/login" className="button button-outline min-h-12 px-8">
                Já tenho conta
              </SellerNavLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-primary text-3xl font-bold text-title">
            Por que vender com a Recoll?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-text sm:text-base">
            Alcance compradores do nosso marketplace com ferramentas pensadas para quem produz e
            revende com responsabilidade.
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
          <h2 className="font-primary text-2xl font-bold text-title">
            Faça parte do marketplace
          </h2>
          <p className="mt-2 text-sm text-text">
            Crie sua conta de vendedor e comece pelo aceite dos termos da plataforma.
          </p>
          <SellerNavLink
            to="/register/terms"
            className="button button-accent mx-auto mt-6 inline-flex min-h-12"
          >
            Criar conta de vendedor
          </SellerNavLink>
        </div>
      </section>

      <footer className="border-t border-edge/30 px-4 py-8 text-center text-xs text-text sm:px-6">
        <p>
          É comprador? Acesse a{" "}
          <a
            href={USER_APP_URL}
            className="font-semibold text-accent hover:underline"
            rel="noopener noreferrer"
            target="_blank"
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
