import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";
import { loadOnboardingDraft } from "../utils/sellerOnboardingStorage";

export function SellerOnboardingPlaceholderPage() {
  const draft = loadOnboardingDraft();

  return (
    <RegisterOnboardingGuard
      requireTerms
      requireCountry
      requireBusinessType
      requireAccount
      requireStore
      requireShipping
    >
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={88}
          title="Próximas etapas do cadastro"
          description={`Envio em ${draft.shippingCity ?? "—"}/${draft.shippingState ?? "—"}. Em breve: revisão dos dados e envio para aprovação. Loja: ${draft.storeName ?? "—"}.`}
          backTo="/register/shipping"
          footer={
            <SellerNavLink to="/" className="button button-outline w-full sm:w-auto">
              Voltar ao início
            </SellerNavLink>
          }
        >
          <p className="onboarding-text">
            Enquanto isso, você pode explorar o painel em modo demonstração após entrar com seu
            e-mail na página de login.
          </p>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}