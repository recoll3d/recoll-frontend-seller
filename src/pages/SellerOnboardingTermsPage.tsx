import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { OnboardingShell } from "../components/onboarding/OnboardingShell";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import {
  hasAcceptedCurrentTerms,
  saveOnboardingDraft,
  TERMS_VERSION,
} from "../utils/sellerOnboardingStorage";

export function SellerOnboardingTermsPage() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(hasAcceptedCurrentTerms());
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!accepted) {
      setError("Você precisa aceitar os termos para continuar.");
      return;
    }
    setError(null);
    saveOnboardingDraft({
      acceptedTermsAt: new Date().toISOString(),
      termsVersion: TERMS_VERSION,
    });
    navigate("/register/coming-soon");
  };

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <OnboardingShell
        progressPercent={10}
        title="Você está se cadastrando para vender na Recoll"
        description="Ao continuar, você concorda com as regras do marketplace e entende que produtos só ficam visíveis para compradores após aprovação da equipe."
        backTo="/"
        footer={
          <button
            type="submit"
            form="seller-terms-form"
            className={`button w-full sm:w-auto sm:min-w-[200px] ${
              accepted ? "button-accent" : "button-disabled"
            }`}
            disabled={!accepted}
          >
            Concordar e continuar
          </button>
        }
      >
        <form id="seller-terms-form" className="space-y-6" onSubmit={onSubmit}>
          <div className="rounded-xl border border-edge/30 bg-gray-50 p-4 text-sm leading-6 text-title">
            <p className="font-semibold">Resumo (versão {TERMS_VERSION})</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[var(--color-onboarding-text)]">
              <li>Dados verdadeiros (PF ou CNPJ conforme seu tipo de negócio).</li>
              <li>Endereço de envio válido para etiquetas de frete.</li>
              <li>Conteúdo de produto sujeito a moderação e aprovação.</li>
              <li>Taxas e repasses conforme política comercial da Recoll.</li>
            </ul>
            <p className="mt-3 text-xs">
              Termos completos serão publicados em breve; esta versão registra seu aceite no
              cadastro.
            </p>
          </div>

          <div className="field-group">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                error && !accepted ? "border-text-red" : "border-edge/40"
              }`}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                checked={accepted}
                onChange={(event) => {
                  setAccepted(event.target.checked);
                  if (event.target.checked) setError(null);
                }}
              />
              <span className="text-sm leading-6 text-title">
                Li e concordo com os termos para vendedores da Recoll e com a{" "}
                <Link to="/" className="font-semibold text-accent hover:underline">
                  política de aprovação de produtos
                </Link>
                .
              </span>
            </label>
            {error ? (
              <span className="error-legend" role="alert">
                {error}
              </span>
            ) : null}
          </div>
        </form>
      </OnboardingShell>
    </div>
  );
}
