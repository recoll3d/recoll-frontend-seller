import { FaBoxOpen, FaShieldHalved, FaStore } from "react-icons/fa6";

import { SellerHeroArt } from "../components/landing/SellerHeroArt";
import { ScrollReveal } from "../components/motion/ScrollReveal";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerSiteFooter } from "../components/layout/SellerSiteFooter";
import { SellerNavLink } from "../components/navigation/SellerNavLink";

const REASONS = [
  {
    icon: FaStore,
    title: "Sua vitrine",
    text: "Catálogo e políticas da loja no padrão Recoll.",
  },
  {
    icon: FaBoxOpen,
    title: "Envio no checkout",
    text: "Frete calculado para o comprador antes do pagamento.",
  },
  {
    icon: FaShieldHalved,
    title: "Pedidos no painel",
    text: "Acompanhe vendas e status em um só lugar.",
  },
];

export function SellerLandingPage() {
  return (
    <div className="flex min-h-full flex-col bg-canvas text-title">
      <SellerSiteHeader />

      <section className="seller-hero-grid w-full border-b border-edge">
        <div className="seller-hero-copy mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="max-w-xl">
            <h1 className="font-primary text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Venda no <span className="text-accent">marketplace Recoll</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-text">
              Monte sua loja, publique anúncios e receba pedidos de quem já compra conosco.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SellerNavLink to="/register/terms" className="button button-accent min-h-12 px-10">
                Começar a vender
              </SellerNavLink>
              <SellerNavLink to="/login" className="button button-outline min-h-12 px-8">
                Entrar
              </SellerNavLink>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:max-w-none lg:pb-0 lg:pr-6">
          <SellerHeroArt />
        </div>
      </section>

      <section className="w-full border-b border-edge bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {REASONS.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={index * 0.06}>
              <article className="seller-feature-card h-full p-6 text-center sm:text-left">
                <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent sm:mx-0">
                  <Icon className="text-xl" aria-hidden />
                </span>
                <h3 className="mt-4 font-primary text-lg font-bold text-title">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text">{text}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="seller-cta-band flex-1 px-4 py-16 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-primary text-2xl font-bold sm:text-3xl">Comece agora</h2>
            <SellerNavLink
              to="/register/terms"
              className="button button-accent mx-auto mt-8 inline-flex min-h-12 px-12"
            >
              Criar conta
            </SellerNavLink>
          </div>
        </ScrollReveal>
      </section>

      <SellerSiteFooter />
    </div>
  );
}