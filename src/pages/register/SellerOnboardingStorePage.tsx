import { type FormEvent, useEffect, useMemo, useState } from "react";

import { FormTextField } from "../../components/forms/FormTextField";
import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import { checkStoreSlugAvailability } from "../../services/storeSlugAvailability";
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
  const [availability, setAvailability] = useState<
    "idle" | "checking" | "free" | "taken" | "error" | "unchecked"
  >("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  const nameError = useMemo(() => {
    if (!touched.name && !submitted) return null;
    return getStoreNameError(storeName);
  }, [storeName, touched.name, submitted]);

  const slugFormatError = getStoreSlugError(storeSlug);
  const slugFieldError =
    (touched.slug || submitted) && slugFormatError
      ? slugFormatError
      : !slugFormatError && (availability === "taken" || availability === "error")
        ? availabilityMessage
        : null;

  const canAdvance =
    !getStoreNameError(storeName) &&
    !slugFormatError &&
    availability !== "taken" &&
    !navigating;

  useEffect(() => {
    if (slugFormatError) {
      setAvailability("idle");
      setSuggestions([]);
      setAvailabilityMessage(null);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void checkStoreSlugAvailability(storeSlug, controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return;
          setSuggestions(result.suggestions);
          if (result.unchecked) {
            setAvailability("unchecked");
            setAvailabilityMessage(null);
            return;
          }
          if (result.available) {
            setAvailability("free");
            setAvailabilityMessage(null);
            return;
          }
          setAvailability("taken");
          setAvailabilityMessage("Esse endereço já está em uso. Escolha uma sugestão ou outro slug.");
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setAvailability("unchecked");
          setSuggestions([]);
          setAvailabilityMessage(null);
        });
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [storeSlug, slugFormatError]);

  useEffect(() => {
    saveOnboardingDraft({
      storeName: storeName.trim(),
      storeSlug: storeSlug.trim(),
    });
  }, [storeName, storeSlug]);

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
    if (nErr || sErr || availability === "taken") return;
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
              error={slugFieldError}
              hint={
                availability === "free"
                    ? "Endereço disponível."
                    : "O nome da loja preenche este campo até você editá-lo. Ele não altera o nome público."
              }
              onChange={(event) => {
                setSlugTouched(true);
                setStoreSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
              onBlur={() => setTouched((t) => ({ ...t, slug: true }))}
            />
            {availability === "taken" && suggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="rounded-full border border-accent/40 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/10"
                    onClick={() => {
                      setSlugTouched(true);
                      setStoreSlug(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}