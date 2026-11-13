import { Link } from "react-router-dom";

import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";

export function SellerOnboardingPlaceholderPage() {
  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <OnboardingShell
        progressPercent={15}
        title="Próxima etapa em breve"
        description="A etapa seguinte (país / tipo de negócio) será a próxima entrega. Seu aceite dos termos já foi salvo neste navegador."
        backTo="/register/terms"
        footer={
          <Link to="/" className="button button-outline w-full sm:w-auto">
            Voltar à página inicial
          </Link>
        }
      >
        <p className="onboarding-text">
          Consulte{" "}
          <code className="rounded bg-gray-100 px-1 text-xs text-title">
            docs/SELLER_APP_BACKLOG.md
          </code>{" "}
          para ver a ordem das telas.
        </p>
      </OnboardingShell>
    </div>
  );
}
