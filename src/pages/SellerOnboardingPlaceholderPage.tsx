import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";
import { loadOnboardingDraft } from "../utils/sellerOnboardingStorage";

export function SellerOnboardingPlaceholderPage() {
  const draft = loadOnboardingDraft();
  const typeLabel =
    draft.businessType === "company"
      ? "empresa (CNPJ)"
      : draft.businessType === "individual"
        ? "pessoa física (CPF)"
        : "—";

  return (
    <RegisterOnboardingGuard requireTerms requireCountry requireBusinessType requireAccount>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={55}
          title="Próximas etapas do cadastro"
          description={`Tipo escolhido: ${typeLabel}. Em breve: nome da loja, endereço de envio e revisão final. Conta (${draft.accountEmail ?? "—"}) já está no rascunho deste navegador.`}
          backTo="/register/account"
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