import { Navigate } from "react-router-dom";

import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";
import { loadOnboardingDraft } from "../utils/sellerOnboardingStorage";

export function SellerOnboardingPlaceholderPage() {
  const draft = loadOnboardingDraft();
  if (!draft.submittedAt) {
    return <Navigate to="/register/review" replace />;
  }

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
          progressPercent={100}
          title="Cadastro enviado"
          backTo="/register/review"
          description={`Recebemos os dados de ${draft.storeName ?? "sua loja"}. Avisamos em ${draft.accountEmail ?? "seu e-mail"} quando a análise terminar.`}
          footer={
            <SellerNavLink to="/" className="button button-accent w-full sm:w-auto">
              Ir para o início
            </SellerNavLink>
          }
        >
          <p className="onboarding-text">
            Enquanto a loja não for aprovada, os anúncios não aparecem para quem compra.
          </p>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}