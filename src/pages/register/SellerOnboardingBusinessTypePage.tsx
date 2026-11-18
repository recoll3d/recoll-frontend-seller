import { type FormEvent, useState } from "react";

import { OnboardingChoiceButton } from "../../components/onboarding/OnboardingChoiceButton";
import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
  type SellerBusinessType,
} from "../../utils/sellerOnboardingStorage";

export function SellerOnboardingBusinessTypePage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const draft = loadOnboardingDraft();
  const [businessType, setBusinessType] = useState<SellerBusinessType | null>(
    draft.businessType ?? null
  );
  const [touched, setTouched] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!businessType) {
      setTouched(true);
      return;
    }
    saveOnboardingDraft({ businessType });
    void navigateWithFeedback("/register/coming-soon");
  };

  return (
    <RegisterOnboardingGuard requireTerms requireCountry>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={35}
          title="Que tipo de vendedor você é?"
          description="Isso define quais dados vamos pedir adiante (CPF ou CNPJ) e o que o comprador vê na sua vitrine."
          backTo="/register/country"
          footer={
            <button
              type="submit"
              form="seller-business-type-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                businessType && !navigating ? "button-accent" : "button-disabled"
              }`}
              disabled={!businessType || navigating}
            >
              Avançar
            </button>
          }
        >
          <form id="seller-business-type-form" className="space-y-3" onSubmit={onSubmit}>
            <OnboardingChoiceButton
              selected={businessType === "individual"}
              onSelect={() => {
                setBusinessType("individual");
                setTouched(false);
              }}
              title="Pessoa física"
              description="Você vende como pessoa física ou MEI com CPF no cadastro."
            />
            <OnboardingChoiceButton
              selected={businessType === "company"}
              onSelect={() => {
                setBusinessType("company");
                setTouched(false);
              }}
              title="Empresa (CNPJ)"
              description="Loja com CNPJ — MEI, EI, LTDA ou equivalente."
            />
            {touched && !businessType ? (
              <span className="error-legend" role="alert">
                Selecione uma opção para continuar.
              </span>
            ) : null}
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}