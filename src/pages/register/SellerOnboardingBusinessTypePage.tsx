import { type FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FormTextField } from "../../components/forms/FormTextField";
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
import {
  formatCnpj,
  formatCpf,
  getTaxDocumentError,
} from "../../utils/taxDocument";
import { digitsOnly } from "../../utils/formInput";

export function SellerOnboardingBusinessTypePage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const draft = loadOnboardingDraft();
  const [businessType, setBusinessType] = useState<SellerBusinessType | null>(
    draft.businessType ?? null
  );
  const initialDoc =
    draft.businessType === "company"
      ? formatCnpj(draft.taxDocument ?? "")
      : draft.businessType === "individual"
        ? formatCpf(draft.taxDocument ?? "")
        : "";
  const [taxDocument, setTaxDocument] = useState(initialDoc);
  const [typeTouched, setTypeTouched] = useState(false);
  const [docTouched, setDocTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const docError = useMemo(() => {
    if (!businessType) return null;
    if (!docTouched && !submitted) return null;
    return getTaxDocumentError(businessType, taxDocument);
  }, [businessType, taxDocument, docTouched, submitted]);

  const canAdvance =
    businessType &&
    !getTaxDocumentError(businessType, taxDocument) &&
    !navigating;

  const onSelectType = (type: SellerBusinessType) => {
    setBusinessType(type);
    setTypeTouched(false);
    setDocTouched(false);
    if (type !== draft.businessType) {
      setTaxDocument("");
    } else if (draft.taxDocument) {
      setTaxDocument(type === "company" ? formatCnpj(draft.taxDocument) : formatCpf(draft.taxDocument));
    }
  };

  const onDocChange = (value: string) => {
    if (businessType === "company") {
      setTaxDocument(formatCnpj(value));
    } else if (businessType === "individual") {
      setTaxDocument(formatCpf(value));
    }
    if (submitted || docTouched) {
      // revalidate live
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!businessType) {
      setTypeTouched(true);
      return;
    }
    const err = getTaxDocumentError(businessType, taxDocument);
    if (err) {
      setDocTouched(true);
      return;
    }
    saveOnboardingDraft({
      businessType,
      taxDocument: digitsOnly(taxDocument),
    });
    void navigateWithFeedback("/register/account");
  };

  return (
    <RegisterOnboardingGuard requireTerms requireCountry>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={35}
          title="Que tipo de vendedor você é?"
          description="Escolha uma opção e informe o documento abaixo."
          backTo="/register/country"
          footer={
            <button
              type="submit"
              form="seller-business-type-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                canAdvance ? "button-accent" : "button-disabled"
              }`}
              disabled={!canAdvance}
            >
              Avançar
            </button>
          }
        >
          <form id="seller-business-type-form" className="space-y-3" onSubmit={onSubmit}>
            <OnboardingChoiceButton
              selected={businessType === "individual"}
              onSelect={() => onSelectType("individual")}
              title="Pessoa física"
              description="Venda com CPF (inclui MEI que usa CPF no cadastro)."
            />
            <OnboardingChoiceButton
              selected={businessType === "company"}
              onSelect={() => onSelectType("company")}
              title="Empresa (CNPJ)"
              description="Loja com CNPJ."
            />
            {typeTouched && !businessType ? (
              <span className="error-legend" role="alert">
                Selecione uma opção para continuar.
              </span>
            ) : null}

            <AnimatePresence initial={false}>
              {businessType ? (
                <motion.div
                  key={businessType}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <FormTextField
                      id="seller-tax-document"
                      label={businessType === "individual" ? "CPF" : "CNPJ"}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={
                        businessType === "individual" ? "000.000.000-00" : "00.000.000/0000-00"
                      }
                      value={taxDocument}
                      error={docError}
                      onChange={(event) => onDocChange(event.target.value)}
                      onBlur={() => setDocTouched(true)}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}