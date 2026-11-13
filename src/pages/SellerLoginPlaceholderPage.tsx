import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FormTextField } from "../components/forms/FormTextField";
import { SellerSiteHeader } from "../components/layout/SellerSiteHeader";
import { useSellerAuth } from "../contexts/SellerAuthContext";
import { getEmailFormatError } from "../utils/formInput";

export function SellerLoginPlaceholderPage() {
  const navigate = useNavigate();
  const { signInPlaceholder } = useSellerAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const err = getEmailFormatError(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError(null);
    signInPlaceholder(email.trim());
    navigate("/dashboard");
  };

  return (
    <div className="min-h-full bg-canvas">
      <SellerSiteHeader compact />
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="onboarding-card">
          <h1 className="onboarding-title">Entrar como vendedor</h1>
          <p className="onboarding-text mt-2">
            Login real com o backend virá na próxima fase. Por enquanto, use um e-mail válido para
            ver o fluxo do painel.
          </p>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <FormTextField
              id="seller-login-email"
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              error={emailError}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError(getEmailFormatError(event.target.value));
              }}
            />
            <button type="submit" className="button button-accent w-full">
              Continuar
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--color-onboarding-text)]">
            Novo por aqui?{" "}
            <Link to="/register/terms" className="font-semibold text-accent">
              Começar cadastro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
