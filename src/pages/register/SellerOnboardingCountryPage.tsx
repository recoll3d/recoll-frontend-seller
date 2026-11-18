import { type FormEvent, useState } from "react";

import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../../utils/sellerOnboardingStorage";

export function SellerOnboardingCountryPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const draft = loadOnboardingDraft();
  const [country, setCountry] = useState<"BR" | "">(draft.country ?? "BR");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (country !== "BR") return;
    saveOnboardingDraft({ country: "BR" });
    void navigateWithFeedback("/register/business-type");
  };

  return (
    <RegisterOnboardingGuard requireTerms>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={20}
          title="Onde sua loja está registrada?"
          description="Por enquanto o programa de vendedores atende operações no Brasil. Selecione o país e avance."
          backTo="/register/terms"
          footer={
            <button
              type="submit"
              form="seller-country-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                country && !navigating ? "button-accent" : "button-disabled"
              }`}
              disabled={!country || navigating}
            >
              Avançar
            </button>
          }
        >
          <form id="seller-country-form" onSubmit={onSubmit}>
            <div className="field-group">
              <label className="field-label" htmlFor="seller-country">
                País
              </label>
              <select
                id="seller-country"
                className="input select-input"
                value={country}
                onChange={(event) => setCountry(event.target.value as "BR" | "")}
              >
                <option value="BR">Brasil</option>
              </select>
              <span className="field-hint">
                Novos países serão anunciados quando o programa expandir.
              </span>
            </div>
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}