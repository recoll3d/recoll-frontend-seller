import { FaBoxOpen, FaShieldHalved, FaStore } from "react-icons/fa6";

import { LANDING_HERO_ATTRIBUTION, LANDING_HERO_IMAGE } from "../config/landingMedia";
import { ScrollReveal } from "../components/motion/ScrollReveal";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";

const USER_APP_URL =
  import.meta.env.VITE_USER_APP_URL?.replace(/\/$/, "") ?? "https://re-coll.vercel.app";

const STATS = [
  { value: "1 painel", label: "Pedidos e anúncios" },
  { value: "Checkout", label: "Frete na compra" },
  { value: "Pix + cartão", label: "Pagamento Recoll" },
];

const REASONS = [
  {
    icon: FaStore,
    title: "Vitrine profissional",
    text: "Nome da loja, políticas e catálogo organizados para quem compra no marketplace.",
  },
  {
    icon: FaBoxOpen,
    title: "Envio integrado",
    text: "Informe o endereço de despacho; o comprador fecha o frete antes de pagar.",
  },
  {
    icon: FaShieldHalved,
    title: "Repasse claro",
    text: "Acompanhe vendas no painel do vendedor com o mesmo padrão de confiança da Recoll.",
  },
];

export function SellerLandingPage() {
  return (
    <div className="min-h-full overflow-x-hidden bg-canvas text-title">
      <SellerSiteHeader />

      {/* Hero assimétrico — diferente do app comprador (sem drawer / feed marketplace) */}
      <section className="seller-hero-grid border-b border-edge/40">
        <div className="seller-hero-copy px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <p className="inline-block rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            Portal do vendedor
          </p>
          <h1 className="mt-5 font-primary text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Abra sua loja no
            <span className="block text-accent">marketplace Recoll</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-text">
            Cadastro em etapas curtas, revisão da nossa equipe e produtos publicados só depois da
            aprovação — para proteger quem compra e quem vende.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SellerNavLink
              to="/register/terms"
              className="button button-accent min-h-12 px-10 shadow-[0_8px_32px_rgba(5,242,131,0.25)]"
            >
              Começar a vender
            </SellerNavLink>
            <SellerNavLink to="/login" className="button button-outline min-h-12 px-8">
              Já tenho conta
            </SellerNavLink>
          </div>
        </div>

        <div className="seller-hero-visual relative min-h-[280px] sm:min-h-[360px] lg:min-h-full">
          <img
            src={LANDING_HERO_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-canvas via-canvas/40 to-transparent lg:from-canvas/90 lg:via-canvas/20" />
          <p className="absolute bottom-3 right-3 max-w-[14rem] text-right text-[10px] leading-snug text-text/80">
            Foto:{" "}
            <a
              href={LANDING_HERO_ATTRIBUTION.unsplashUrl}
              className="underline hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {LANDING_HERO_ATTRIBUTION.photographer}
            </a>
            {" / Unsplash"}
          </p>
        </div>
      </section>

      <section className="border-b border-edge/30 bg-surface/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {STATS.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.08}>
              <div className="text-center sm:text-left">
                <p className="font-primary text-2xl font-bold text-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-text">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="font-primary text-3xl font-bold text-title sm:text-4xl">
              Feito para quem quer vender com seriedade
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-text sm:text-base">
              Ferramentas essenciais sem enrolação — do cadastro à publicação do primeiro anúncio.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, text }, index) => (
            <ScrollReveal key={title} delay={0.05 + index * 0.12}>
              <article className="seller-feature-card h-full p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="text-xl" aria-hidden />
                </span>
                <h3 className="mt-4 font-primary text-xl font-bold text-title">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-text">{text}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="seller-cta-band px-4 py-14 sm:px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-primary text-2xl font-bold sm:text-3xl">
              Pronto para abrir sua conta?
            </h2>
            <p className="mt-3 text-sm text-text">
              Aceite os termos e informe se vende como pessoa física ou empresa.
            </p>
            <SellerNavLink
              to="/register/terms"
              className="button button-accent mx-auto mt-8 inline-flex min-h-12 px-12"
            >
              Criar conta de vendedor
            </SellerNavLink>
          </div>
        </ScrollReveal>
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