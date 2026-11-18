import { type FormEvent, useEffect, useMemo, useState } from "react";

import { FormTextField } from "../../components/forms/FormTextField";
import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import { formatCep, fetchAddressByCep, sanitizeCep } from "../../utils/viacep";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../../utils/sellerOnboardingStorage";

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export function SellerOnboardingShippingPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const draft = loadOnboardingDraft();
  const [postalCode, setPostalCode] = useState(formatCep(draft.shippingPostalCode ?? ""));
  const [street, setStreet] = useState(draft.shippingStreet ?? "");
  const [number, setNumber] = useState(draft.shippingNumber ?? "");
  const [complement, setComplement] = useState(draft.shippingComplement ?? "");
  const [neighborhood, setNeighborhood] = useState(draft.shippingNeighborhood ?? "");
  const [city, setCity] = useState(draft.shippingCity ?? "");
  const [state, setState] = useState(draft.shippingState ?? "");
  const [cepError, setCepError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    saveOnboardingDraft({
      shippingPostalCode: sanitizeCep(postalCode),
      shippingStreet: street.trim(),
      shippingNumber: number.trim(),
      shippingComplement: complement.trim(),
      shippingNeighborhood: neighborhood.trim(),
      shippingCity: city.trim(),
      shippingState: state,
    });
  }, [postalCode, street, number, complement, neighborhood, city, state]);

  const errors = useMemo(() => {
    if (!submitted) return {} as Record<string, string>;
    const next: Record<string, string> = {};
    if (sanitizeCep(postalCode).length !== 8) next.postalCode = "Informe um CEP com 8 dígitos.";
    if (street.trim().length < 3) next.street = "Informe a rua.";
    if (!number.trim()) next.number = "Informe o número.";
    if (neighborhood.trim().length < 2) next.neighborhood = "Informe o bairro.";
    if (city.trim().length < 2) next.city = "Informe a cidade.";
    if (!STATES.includes(state)) next.state = "Selecione o estado.";
    return next;
  }, [submitted, postalCode, street, number, neighborhood, city, state]);

  const canAdvance =
    sanitizeCep(postalCode).length === 8 &&
    street.trim().length >= 3 &&
    Boolean(number.trim()) &&
    neighborhood.trim().length >= 2 &&
    city.trim().length >= 2 &&
    STATES.includes(state) &&
    !navigating &&
    !lookingUp;

  const lookupCep = async (value: string) => {
    if (sanitizeCep(value).length !== 8) return;
    setLookingUp(true);
    setCepError(null);
    try {
      const found = await fetchAddressByCep(value);
      if (found.street) setStreet(found.street);
      if (found.neighborhood) setNeighborhood(found.neighborhood);
      if (found.city) setCity(found.city);
      if (found.state) setState(found.state);
    } catch (error) {
      setCepError(error instanceof Error ? error.message : "Não foi possível consultar o CEP.");
    } finally {
      setLookingUp(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (
      sanitizeCep(postalCode).length !== 8 ||
      street.trim().length < 3 ||
      !number.trim() ||
      neighborhood.trim().length < 2 ||
      city.trim().length < 2 ||
      !STATES.includes(state)
    ) {
      return;
    }
    saveOnboardingDraft({
      shippingPostalCode: sanitizeCep(postalCode),
      shippingStreet: street.trim(),
      shippingNumber: number.trim(),
      shippingComplement: complement.trim(),
      shippingNeighborhood: neighborhood.trim(),
      shippingCity: city.trim(),
      shippingState: state,
    });
    void navigateWithFeedback("/register/review");
  };

  return (
    <RegisterOnboardingGuard requireTerms requireCountry requireBusinessType requireAccount requireStore>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={80}
          title="De onde você envia?"
          description="Usamos esse endereço para calcular frete e organizar a coleta dos pedidos."
          backTo="/register/store"
          footer={
            <button
              type="submit"
              form="seller-shipping-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                canAdvance ? "button-accent" : "button-disabled"
              }`}
              disabled={!canAdvance}
            >
              Avançar
            </button>
          }
        >
          <form id="seller-shipping-form" className="space-y-4" onSubmit={onSubmit} noValidate>
            <FormTextField
              id="seller-shipping-cep"
              label="CEP"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={postalCode}
              error={errors.postalCode ?? cepError}
              hint={lookingUp ? "Buscando endereço…" : undefined}
              onChange={(event) => {
                const next = formatCep(event.target.value);
                setPostalCode(next);
                setCepError(null);
                if (sanitizeCep(next).length === 8) void lookupCep(next);
              }}
            />
            <FormTextField
              id="seller-shipping-street"
              label="Rua"
              autoComplete="address-line1"
              value={street}
              error={errors.street}
              onChange={(event) => setStreet(event.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormTextField
                id="seller-shipping-number"
                label="Número"
                autoComplete="off"
                value={number}
                error={errors.number}
                onChange={(event) => setNumber(event.target.value)}
              />
              <FormTextField
                id="seller-shipping-complement"
                label="Complemento"
                autoComplete="address-line2"
                placeholder="Apto, sala, bloco (opcional)"
                value={complement}
                onChange={(event) => setComplement(event.target.value)}
              />
            </div>
            <FormTextField
              id="seller-shipping-neighborhood"
              label="Bairro"
              autoComplete="off"
              value={neighborhood}
              error={errors.neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
              <FormTextField
                id="seller-shipping-city"
                label="Cidade"
                autoComplete="address-level2"
                value={city}
                error={errors.city}
                onChange={(event) => setCity(event.target.value)}
              />
              <div className="field-group">
                <label className="field-label" htmlFor="seller-shipping-state">
                  UF
                </label>
                <select
                  id="seller-shipping-state"
                  className={`input select-input ${errors.state ? "error-input" : ""}`}
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                >
                  <option value="">—</option>
                  {STATES.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                {errors.state ? <span className="error-legend">{errors.state}</span> : null}
              </div>
            </div>
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}