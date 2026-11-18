import { type FormEvent, useEffect, useMemo, useState } from "react";

import { FormPasswordField } from "../../components/forms/FormPasswordField";
import { FormTextField } from "../../components/forms/FormTextField";
import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import {
  getEmailFormatError,
  getPasswordConfirmError,
  getPasswordError,
} from "../../utils/formInput";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../../utils/sellerOnboardingStorage";

export function SellerOnboardingAccountPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const draft = loadOnboardingDraft();
  const [email, setEmail] = useState(draft.accountEmail ?? "");
  const [password, setPassword] = useState(draft.accountPassword ?? "");
  const [confirmPassword, setConfirmPassword] = useState(draft.accountPassword ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });

  const emailError = useMemo(() => {
    if (!touched.email && !submitted) return null;
    return getEmailFormatError(email);
  }, [email, touched.email, submitted]);

  const passwordError = useMemo(() => {
    if (!touched.password && !submitted) return null;
    return getPasswordError(password);
  }, [password, touched.password, submitted]);

  const confirmError = useMemo(() => {
    if (!touched.confirm && !submitted) return null;
    return getPasswordConfirmError(password, confirmPassword);
  }, [password, confirmPassword, touched.confirm, submitted]);

  useEffect(() => {
    saveOnboardingDraft({
      accountEmail: email.trim().toLowerCase(),
      accountPassword: password,
    });
  }, [email, password]);

  const canAdvance =
    !getEmailFormatError(email) &&
    !getPasswordError(password) &&
    !getPasswordConfirmError(password, confirmPassword) &&
    !navigating;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const eErr = getEmailFormatError(email);
    const pErr = getPasswordError(password);
    const cErr = getPasswordConfirmError(password, confirmPassword);
    if (eErr || pErr || cErr) return;
    saveOnboardingDraft({
      accountEmail: email.trim().toLowerCase(),
      accountPassword: password,
    });
    void navigateWithFeedback("/register/store");
  };

  return (
    <RegisterOnboardingGuard requireTerms requireCountry requireBusinessType>
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={50}
          title="Dados de acesso"
          description="Este e-mail será usado para entrar no painel do vendedor. Se você já compra na Recoll, pode usar o mesmo endereço."
          backTo="/register/business-type"
          footer={
            <button
              type="submit"
              form="seller-account-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                canAdvance ? "button-accent" : "button-disabled"
              }`}
              disabled={!canAdvance}
            >
              Avançar
            </button>
          }
        >
          <form id="seller-account-form" className="space-y-4" onSubmit={onSubmit} noValidate>
            <FormTextField
              id="seller-account-email"
              label="E-mail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              error={emailError}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            <FormPasswordField
              id="seller-account-password"
              label="Senha"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              error={passwordError}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            />
            <FormPasswordField
              id="seller-account-password-confirm"
              label="Confirmar senha"
              autoComplete="new-password"
              value={confirmPassword}
              error={confirmError}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
            />
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}