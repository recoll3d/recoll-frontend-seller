import { type FormEvent, useState } from "react";

import { FormPasswordField } from "../components/forms/FormPasswordField";
import { FormTextField } from "../components/forms/FormTextField";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../components/navigation/SellerNavLink";
import { useSellerAuth } from "../contexts/SellerAuthContext";
import { useSellerNavigation } from "../contexts/SellerNavigationContext";
import { loginSellerAccount } from "../services/sellerAccount";
import { getEmailFormatError, getPasswordError } from "../utils/formInput";

export function SellerLoginPlaceholderPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const { signIn } = useSellerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const validateEmail = (value: string) => getEmailFormatError(value);

  const onBlurEmail = () => {
    const err = validateEmail(email);
    if (err || submitted) setEmailError(err);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const err = validateEmail(email);
    const passwordErr = getPasswordError(password);
    setEmailError(err);
    setPasswordError(passwordErr);
    if (err || passwordErr) return;
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
    setSending(true);
    void loginSellerAccount(email.trim(), password)
      .then((result) => {
        signIn({
          token: result.token,
          email: result.seller.email,
          sellerId: result.seller.id,
          storeName: result.seller.storeName,
          storeSlug: result.seller.storeSlug,
          status: result.seller.status,
        });
        void navigateWithFeedback("/dashboard");
      })
      .catch((error: unknown) => {
        setFormError(error instanceof Error ? error.message : "Não foi possível entrar.");
      })
      .finally(() => setSending(false));
  };

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="onboarding-card">
          <h1 className="onboarding-title">Entrar como vendedor</h1>
          <p className="onboarding-text mt-2">
            Use o e-mail e a senha da sua conta de vendedor.
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
            <FormPasswordField
              id="seller-login-password"
              label="Senha"
              autoComplete="current-password"
              value={password}
              error={passwordError}
              onChange={(event) => {
                setPassword(event.target.value);
                if (submitted || passwordError) {
                  setPasswordError(getPasswordError(event.target.value));
                }
              }}
              onBlur={() => {
                if (submitted || password) setPasswordError(getPasswordError(password));
              }}
            />
            {formError ? <p className="error-legend">{formError}</p> : null}
            <button
              type="submit"
              className={`button w-full ${navigating || sending ? "button-disabled" : "button-accent"}`}
              disabled={navigating || sending}
            >
              {sending ? "Entrando…" : "Entrar"}
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
