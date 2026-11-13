import { type FormEvent, useState } from "react";

import { FormTextField } from "../components/forms/FormTextField";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";
import { useSellerAuth } from "../contexts/SellerAuthContext";
import { useSellerNavigation } from "../contexts/SellerNavigationContext";
import { getEmailFormatError } from "../utils/formInput";

export function SellerLoginPlaceholderPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const { signInPlaceholder } = useSellerAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => getEmailFormatError(value);

  const onBlurEmail = () => {
    const err = validateEmail(email);
    if (err || submitted) setEmailError(err);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError(null);
    signInPlaceholder(email.trim());
    void navigateWithFeedback("/dashboard");
  };

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="onboarding-card">
          <h1 className="onboarding-title">Entrar como vendedor</h1>
          <p className="onboarding-text mt-2">
            Use o e-mail da sua conta de vendedor. Em breve este login será integrado ao backend da
            Recoll.
          </p>
          <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
            <FormTextField
              id="seller-login-email"
              label="E-mail"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              error={emailError}
              onChange={(event) => {
                setEmail(event.target.value);
                if (submitted || emailError) {
                  setEmailError(validateEmail(event.target.value));
                }
              }}
              onBlur={onBlurEmail}
            />
            <button
              type="submit"
              className={`button w-full ${navigating ? "button-disabled" : "button-accent"}`}
              disabled={navigating}
            >
              Continuar
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-text">
            Novo por aqui?{" "}
            <SellerNavLink to="/register/terms" className="font-semibold text-accent">
              Criar conta de vendedor
            </SellerNavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
