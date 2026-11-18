import { type FormEvent, useMemo, useState } from "react";

import { FormTextField } from "../../components/forms/FormTextField";
import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import {
  getStoreNameError,
  getStoreSlugError,
  slugifyStoreName,
} from "../../utils/storeSlug";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../../utils/sellerOnboardingStorage";

export function SellerOnboardingStorePage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const draft = loadOnboardingDraft();
  const [storeName, setStoreName] = useState(draft.storeName ?? "");
  const [storeSlug, setStoreSlug] = useState(draft.storeSlug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(draft.storeSlug));
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ name: false, slug: false });

  const nameError = useMemo(() => {
    if (!touched.name && !submitted) return null;
    return getStoreNameError(storeName);
  }, [storeName, touched.name, submitted]);

  const slugError = useMemo(() => {
    if (!touched.slug && !submitted) return null;
    return getStoreSlugError(storeSlug);
  }, [storeSlug, touched.slug, submitted]);

  const canAdvance =
    !getStoreNameError(storeName) &&
    !getStoreSlugError(storeSlug) &&
    !navigating;

  const onNameChange = (value: string) => {
    setStoreName(value);
    if (!slugTouched) {
      setStoreSlug(slugifyStoreName(value));
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const nErr = getStoreNameError(storeName);
    const sErr = getStoreSlugError(storeSlug);
    if (nErr || sErr) return;
    saveOnboardingDraft({
      storeName: storeName.trim(),
      storeSlug: storeSlug.trim(),
    });
    void navigateWithFeedback("/register/shipping");
  };

  return (
    <RegisterOnboardingGuard requireTerms requireCountry requireBusinessType requireAccount>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={65}
          title="Nome da sua loja"
          description="É como os compradores vão reconhecer você. O endereço (slug) aparece na URL pública da loja."
          backTo="/register/account"
          footer={
            <button
              type="submit"
              form="seller-store-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                canAdvance ? "button-accent" : "button-disabled"
              }`}
              disabled={!canAdvance}
            >
              Avançar
            </button>
          }
        >
          <form id="seller-store-form" className="space-y-4" onSubmit={onSubmit} noValidate>
            <FormTextField
              id="seller-store-name"
              label="Nome público da loja"
              autoComplete="organization"
              placeholder="Ex.: Loja do João"
              value={storeName}
              error={nameError}
              onChange={(event) => onNameChange(event.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            />
            <FormTextField
              id="seller-store-slug"
              label="Endereço da loja (slug)"
              autoComplete="off"
              spellCheck={false}
              placeholder="loja-do-joao"
              value={storeSlug}
              error={slugError}
              hint="recoll.com.br/loja/seu-slug (exemplo — URL final pode variar)."
              onChange={(event) => {
                setSlugTouched(true);
                setStoreSlug(event.target.value.toLowerCase());
              }}
              onBlur={() => setTouched((t) => ({ ...t, slug: true }))}
            />
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}