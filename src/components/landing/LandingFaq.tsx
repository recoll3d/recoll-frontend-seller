import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

type FaqItem = { q: string; a: string };

const ITEMS: FaqItem[] = [
  {
    q: "Quem pode abrir loja na Recoll?",
    a: "Operações no Brasil, como pessoa física ou empresa, desde que aceitem os termos do vendedor e concluam o cadastro.",
  },
  {
    q: "Há custo para criar anúncios?",
    a: "As condições de taxas e comissões ficam nos termos oficiais. Quando houver cobrança, ela é informada antes de você confirmar qualquer ação na conta.",
  },
  {
    q: "Como o frete entra na venda?",
    a: "Quem compra escolhe a modalidade e vê o valor no checkout. Depois da venda, você separa o pedido, envia e registra o andamento no painel.",
  },
  {
    q: "Por que meu anúncio pode demorar a aparecer?",
    a: "Cada produto é conferido pela equipe Recoll para manter padrão e segurança. Só depois da aprovação ele fica visível no marketplace.",
  },
];

export function LandingFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

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
                  className={`shrink-0 text-accent transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  key="panel"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-6 text-text">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}