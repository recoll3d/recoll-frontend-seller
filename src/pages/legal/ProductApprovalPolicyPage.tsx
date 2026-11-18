import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { SellerSiteFooter } from "../../components/layout/SellerSiteFooter";

export function ProductApprovalPolicyPage() {
  return (
    <div className="flex min-h-full flex-col bg-canvas text-title">
      <SellerSiteHeader compact />
      <main className="page-content mx-auto w-full max-w-3xl flex-1">
        <h1 className="page-title">Política de aprovação de produtos</h1>
        <p className="mt-4 text-sm leading-7 text-text">
          Como a Recoll analisa anúncios de vendedores antes de exibi-los aos compradores.
        </p>

        <section className="surface-card mt-8 space-y-4 p-6 text-sm leading-7 text-text">
          <h2 className="font-primary text-xl font-bold text-title">1. Objetivo</h2>
          <p>
            Garantir que cada produto atenda às regras da plataforma, informações corretas ao
            consumidor e padrões de segurança e qualidade da Recoll.
          </p>

          <h2 className="font-primary text-xl font-bold text-title">2. Quando a análise ocorre</h2>
          <p>
            Todo novo produto ou alteração relevante (título, imagens, preço, categoria ou
            descrição) entra em fila de revisão. Até a aprovação, o anúncio{" "}
            <strong className="text-title">não aparece</strong> na vitrine pública.
          </p>

          <h2 className="font-primary text-xl font-bold text-title">3. Critérios</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Informações verdadeiras e compatíveis com o tipo de vendedor (PF ou empresa).</li>
            <li>Imagens e descrições sem conteúdo proibido ou enganoso.</li>
            <li>Categoria e atributos adequados ao item ofertado.</li>
            <li>Conformidade com leis aplicáveis e com os termos do vendedor.</li>
          </ul>

          <h2 className="font-primary text-xl font-bold text-title">4. Prazos e comunicação</h2>
          <p>
            O prazo de análise pode variar conforme a demanda da equipe. O status do produto fica
            disponível no painel do vendedor (aprovado, em revisão ou recusado, com motivo quando
            aplicável).
          </p>

          <h2 className="font-primary text-xl font-bold text-title">5. Recusa e recurso</h2>
          <p>
            Produtos recusados podem ser corrigidos e reenviados. Em caso de dúvida, entre em contato
            pelo canal de suporte indicado no painel.
          </p>

          <p className="text-xs text-text opacity-80">
            Última atualização: 13 de novembro de 2025. A Recoll pode atualizar esta política;
            alterações relevantes serão comunicadas aos vendedores.
          </p>
        </section>
      </main>
      <SellerSiteFooter />
    </div>
  );
}