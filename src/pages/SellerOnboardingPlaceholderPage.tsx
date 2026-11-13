import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";

export function SellerOnboardingPlaceholderPage() {
  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <OnboardingShell
        progressPercent={15}
        title="Cadastro em andamento"
        description="Os próximos passos (tipo de negócio, dados da loja e documentos) serão liberados em atualizações desta aplicação. Seu aceite dos termos permanece salvo neste navegador."
        backTo="/register/terms"
        footer={
          <SellerNavLink to="/" className="button button-outline w-full sm:w-auto">
            Voltar ao início
          </SellerNavLink>
        }
      >
        <p className="onboarding-text">
          Enquanto isso, você pode explorar o painel em modo de demonstração após entrar com seu
          e-mail na página de login.
        </p>
      </OnboardingShell>
    </div>
  );
}
