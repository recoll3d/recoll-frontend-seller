import { useId, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

type FaqItem = { q: string; a: string };

const ITEMS: FaqItem[] = [
  {
    q: "Quem pode vender na Recoll?",
    a: "Vendedores no Brasil, pessoa física ou jurídica, que aceitam os termos da plataforma e passam pelo cadastro guiado.",
  },
  {
    q: "Preciso pagar para anunciar?",
    a: "O cadastro e a publicação de anúncios seguem as regras vigentes da Recoll. Taxas e comissões, quando aplicáveis, aparecem nos termos e no painel antes de você confirmar.",
  },
  {
    q: "Como funcionam envios e frete?",
    a: "O comprador vê opções de frete no checkout. Você prepara e despacha o pedido conforme o método escolhido e atualiza o status no painel do vendedor.",
  },
  {
    q: "Quando meu produto aparece na loja?",
    a: "Anúncios passam por revisão para manter qualidade e segurança. Após aprovação, ficam visíveis para quem compra no marketplace.",
  },
];

export function LandingFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-edge rounded-2xl border border-edge bg-surface/60">
      {ITEMS.map((item, index) => {
        const expanded = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const btnId = `${baseId}-btn-${index}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={btnId}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span className="font-primary text-sm font-semibold text-title sm:text-base">{item.q}</span>
                <FaChevronDown
                  className={`shrink-0 text-accent transition-transform ${expanded ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!expanded}
              className="px-5 pb-4 text-sm leading-6 text-text"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}