import {
  FaArrowRight,
  FaBoxOpen,
  FaChartLine,
  FaHeadset,
  FaShieldHalved,
  FaStore,
  FaTruckFast,
} from "react-icons/fa6";

import { LandingFaq } from "../components/landing/LandingFaq";
import { SellerHeroArt } from "../components/landing/SellerHeroArt";
import { ScrollReveal } from "../components/motion/ScrollReveal";
import { SellerSiteFooter } from "../components/layout/SellerSiteFooter";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";
import { LANDING_HERO_IMAGE, LANDING_WORK_IMAGE } from "../config/landingMedia";

const STATS = [
  { value: "Brasil", label: "Cadastro focado no mercado local" },
  { value: "Checkout", label: "Frete calculado antes do pagamento" },
  { value: "Painel", label: "Pedidos e loja em um só lugar" },
];

const BENEFITS = [
  {
    icon: FaStore,
    title: "Vitrine da sua marca",
    text: "Nome, políticas e catálogo no visual Recoll — o comprador reconhece sua loja na hora.",
  },
  {
    icon: FaTruckFast,
    title: "Envio no checkout",
    text: "O cliente escolhe frete com valor claro. Você foca em separar e despachar com segurança.",
  },
  {
    icon: FaShieldHalved,
    title: "Revisão de anúncios",
    text: "Produtos passam por aprovação para proteger compradores e manter confiança no marketplace.",
  },
  {
    icon: FaChartLine,
    title: "Visão dos pedidos",
    text: "Acompanhe vendas e status sem planilhas soltas — tudo centralizado no painel do vendedor.",
  },
  {
    icon: FaBoxOpen,
    title: "Operação simples",
    text: "Fluxo pensado para quem vende sozinho ou com equipe pequena, do primeiro anúncio à entrega.",
  },
  {
    icon: FaHeadset,
    title: "Suporte em evolução",
    text: "Central de ajuda e canais oficiais serão ampliados conforme a base de vendedores crescer.",
  },
];

const STEPS = [
  { n: "1", title: "Crie sua conta", text: "Aceite os termos e informe país e tipo de negócio." },
  { n: "2", title: "Configure a loja", text: "Complete dados e políticas para publicar com segurança." },
  { n: "3", title: "Publique anúncios", text: "Envie produtos para revisão e, aprovados, ficam no ar." },
  { n: "4", title: "Receba pedidos", text: "Atualize envio no painel e conquiste avaliações." },
];

const SOLUTIONS = [
  {
    title: "Anuncie com clareza",
    text: "Título, fotos e descrição alinhados às regras da Recoll — menos surpresa na moderação.",
  },
  {
    title: "Entregue com previsibilidade",
    text: "Prazos e fretes visíveis no checkout ajudam o cliente a comprar e você a planejar a expedição.",
  },
  {
    title: "Gerencie no painel",
    text: "Status do pedido, histórico e configurações da conta sem alternar entre vários sistemas.",
  },
];

export function SellerLandingPage() {
  return (
    <div className="flex min-h-full flex-col bg-canvas text-title">
      <SellerSiteHeader />

      {/* Hero — foto real */}
      <section className="seller-hero-grid w-full border-b border-edge">
        <div className="seller-hero-copy mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Central do vendedor</p>
          <div className="mt-3 max-w-xl">
            <h1 className="font-primary text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Leve seu negócio ao <span className="text-accent">marketplace Recoll</span>
            </h1>
            <p className="mt-4 text-base leading-7 text-text">
              Cadastro guiado, vitrine profissional e pedidos integrados ao ecossistema que o comprador já usa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SellerNavLink to="/register/terms" className="button button-accent min-h-12 px-10">
                Começar a vender
              </SellerNavLink>
              <SellerNavLink to="/login" className="button button-outline min-h-12 px-8">
                Entrar
              </SellerNavLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text" aria-label="Destaques">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                Sem burocracia desnecessária no cadastro
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                Anúncios revisados antes de irem ao ar
              </li>
            </ul>
          </div>
        </div>

        <div className="seller-hero-photo-wrap mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:mx-0 lg:max-w-none lg:flex-1 lg:px-0 lg:pb-0">
          <img
            src={LANDING_HERO_IMAGE}
            alt="Vendedora empreendedora usando notebook em ambiente de loja"
            className="seller-hero-photo"
            width={1400}
            height={900}
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* Números / prova social leve */}
      <section className="border-b border-edge bg-surface/50" aria-label="Diferenciais rápidos">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.06}>
              <div className="seller-stat-pill text-center sm:text-left">
                <p className="font-primary text-2xl font-bold text-accent">{s.value}</p>
                <p className="mt-1 text-sm leading-6 text-text">{s.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Vantagens */}
      <section className="w-full border-b border-edge" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <ScrollReveal>
            <div className="max-w-2xl">
              <span className="inline-block h-1 w-10 rounded-full bg-accent" aria-hidden />
              <h2 id="benefits-heading" className="mt-4 font-primary text-3xl font-bold sm:text-4xl">
                Recursos que apoiam a sua loja
              </h2>
              <p className="mt-3 text-base leading-7 text-text">
                Do anúncio à entrega, cada parte do fluxo fala a mesma língua do comprador Recoll.
              </p>
            </div>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, text }, index) => (
              <ScrollReveal key={title} delay={index * 0.05}>
                <article className="seller-feature-card h-full p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon className="text-xl" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-primary text-lg font-bold text-title">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text">{text}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="w-full border-b border-edge bg-gradient-to-b from-[#0f1520] to-canvas" aria-labelledby="steps-heading">
        <LandingStepsSection steps={STEPS} headingId="steps-heading" />
      </section>

      {/* Plataforma — ilustração SVG */}
      <section className="w-full border-b border-edge" aria-labelledby="platform-heading">
        <LandingPlatformSection />
      </section>

      {/* Foto + soluções */}
      <section className="w-full border-b border-edge bg-surface/30" aria-labelledby="solutions-heading">
        <LandingSolutionsSection solutions={SOLUTIONS} />
      </section>

      {/* FAQ */}
      <section className="w-full border-b border-edge" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-16">
          <ScrollReveal>
            <span className="mx-auto block h-1 w-10 rounded-full bg-accent" aria-hidden />
            <h2 id="faq-heading" className="mt-4 text-center font-primary text-3xl font-bold sm:text-4xl">
              Perguntas frequentes
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-text">
              Dúvidas sobre cadastro, frete e publicação — respostas diretas, sem enrolação.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-10">
            <LandingFaq />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="seller-cta-band px-4 py-16 sm:px-6" aria-labelledby="cta-final-heading">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="cta-final-heading" className="font-primary text-3xl font-bold sm:text-4xl">
              Pronto para abrir sua loja?
            </h2>
            <p className="mt-3 text-base leading-7 text-text">
              Abra sua conta de vendedor na Recoll. O cadastro é guiado e costuma levar só alguns minutos.
            </p>
            <SellerNavLink
              to="/register/terms"
              className="button button-accent mx-auto mt-8 inline-flex min-h-12 gap-2 px-12"
            >
              Começar a vender agora
              <FaArrowRight aria-hidden />
            </SellerNavLink>
          </div>
        </ScrollReveal>
      </section>

      <SellerSiteFooter />
    </div>
  );
}

function LandingStepsSection({
  steps,
  headingId,
}: {
  steps: typeof STEPS;
  headingId: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
      <ScrollReveal>
        <h2 id={headingId} className="font-primary text-3xl font-bold sm:text-4xl">
          Comece em poucos passos
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-text">
          O onboarding guia cada etapa. Você avança no seu ritmo, sem formulário gigante de uma vez.
        </p>
      </ScrollReveal>
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.n} className="seller-step-card">
            <ScrollReveal delay={index * 0.07}>
              <span className="seller-step-number" aria-hidden>
                {step.n}
              </span>
              <h3 className="mt-4 font-primary font-bold text-title">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text">{step.text}</p>
            </ScrollReveal>
          </li>
        ))}
      </ol>
      <ScrollReveal className="mt-10">
        <SellerNavLink to="/register/terms" className="button button-accent inline-flex min-h-11 gap-2 px-8">
          Iniciar cadastro
          <FaArrowRight aria-hidden />
        </SellerNavLink>
      </ScrollReveal>
    </div>
  );
}

function LandingPlatformSection() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <ScrollReveal>
        <div>
          <span className="inline-block h-1 w-10 rounded-full bg-accent" aria-hidden />
          <h2 id="platform-heading" className="mt-4 font-primary text-3xl font-bold sm:text-4xl">
            Catálogo, pedidos e envio no mesmo lugar
          </h2>
          <p className="mt-3 text-base leading-7 text-text">
            O painel concentra o que muda no dia a dia: anúncios em revisão, vendas novas e atualização de entrega — sem
            pular entre ferramentas diferentes.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-text">
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Saiba se o anúncio está aguardando aprovação ou já está no ar
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Mesma identidade visual que o comprador vê na Recoll
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Histórico de pedidos e dados da loja acessíveis quando precisar
            </li>
          </ul>
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <SellerHeroArt />
      </ScrollReveal>
    </div>
  );
}

function LandingSolutionsSection({ solutions }: { solutions: typeof SOLUTIONS }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
      <ScrollReveal className="order-2 lg:order-1">
        <div className="seller-split-photo overflow-hidden rounded-2xl border border-edge">
          <img
            src={LANDING_WORK_IMAGE}
            alt="Preparo de pedidos para envio em ambiente de e-commerce"
            className="h-full w-full object-cover"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </div>
      </ScrollReveal>
      <ScrollReveal className="order-1 lg:order-2" delay={0.06}>
        <LandingSolutionsCopy solutions={solutions} />
      </ScrollReveal>
    </div>
  );
}

function LandingSolutionsCopy({ solutions }: { solutions: typeof SOLUTIONS }) {
  return (
    <div>
      <h2 id="solutions-heading" className="font-primary text-3xl font-bold sm:text-4xl">
        Tudo o que sua operação precisa
      </h2>
      <p className="mt-3 text-base leading-7 text-text">
        Do anúncio à entrega, cada parte conversa com o restante da plataforma.
      </p>
      <ul className="mt-8 space-y-5">
        {solutions.map((s) => (
          <li key={s.title} className="border-l-2 border-accent pl-4">
            <h3 className="font-primary font-bold text-title">{s.title}</h3>
            <p className="mt-1 text-sm leading-6 text-text">{s.text}</p>
          </li>
        ))}
      </ul>
      <SellerNavLink to="/legal/product-approval-policy" className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">
        Saiba como funciona a aprovação de produtos
      </SellerNavLink>
    </div>
  );
}
