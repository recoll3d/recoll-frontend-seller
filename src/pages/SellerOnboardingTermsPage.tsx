import { type FormEvent, useState } from "react";

import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../contexts/SellerNavigationContext";
import {
  saveOnboardingDraft,
  TERMS_VERSION,
} from "../utils/sellerOnboardingStorage";

const APPROVAL_POLICY_PATH = "/legal/product-approval-policy";

export function SellerOnboardingTermsPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const [accepted, setAccepted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showCheckboxError = Boolean(error) || (touched && !accepted);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!accepted) {
      setError("Marque a caixa para aceitar os termos e a política de aprovação.");
      return;
    }
    setError(null);
    saveOnboardingDraft({
      acceptedTermsAt: new Date().toISOString(),
      termsVersion: TERMS_VERSION,
    });
    void navigateWithFeedback("/register/coming-soon");
  };

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <OnboardingShell
        progressPercent={10}
        title="Termos para vender na Recoll"
        description="Leia o resumo abaixo. Para seguir, confirme que concorda com as regras do marketplace e com a análise dos seus anúncios antes da publicação."
        backTo="/"
        footer={
          <button
            type="submit"
            form="seller-terms-form"
            className={`button w-full sm:w-auto sm:min-w-[220px] ${
              navigating ? "button-disabled" : "button-accent"
            }`}
            disabled={navigating}
          >
            Concordar e continuar
          </button>
        }
      >
        <form id="seller-terms-form" className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="rounded-xl border border-edge bg-body/40 p-4 text-sm leading-6 text-text">
            <p className="font-semibold text-title">Resumo para vendedores</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Informações verdadeiras (pessoa física ou empresa, conforme seu caso).</li>
              <li>Endereço de envio válido para despacho dos pedidos.</li>
              <li>Produtos revisados pela equipe antes de aparecerem na loja.</li>
              <li>Repasses e taxas conforme contrato e política comercial vigente.</li>
            </ul>
          </div>

          <div className="field-group">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                showCheckboxError && !accepted ? "border-text-red error-input" : "border-edge"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-accent"
                checked={accepted}
                onChange={(event) => {
                  setAccepted(event.target.checked);
                  setTouched(true);
                  if (event.target.checked) setError(null);
                }}
                onBlur={() => setTouched(true)}
              />
              <span className="text-sm leading-6 text-title">
                Li e concordo com os termos para vendedores da Recoll e com a{" "}
                <a
                  href={APPROVAL_POLICY_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  política de aprovação de produtos
                </a>
                .
              </span>
            </label>
            {showCheckboxError && !accepted ? (
              <span className="error-legend" role="alert">
                {error ?? "Marque a caixa para aceitar os termos e a política de aprovação."}
              </span>
            ) : null}
          </div>
        </form>
      </OnboardingShell>
    </div>
  );
}
