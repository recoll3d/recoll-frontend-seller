import { type FormEvent, type ReactNode, useState } from "react";

import { OnboardingShell } from "../../components/onboarding/OnboardingShell";
import { RegisterOnboardingGuard } from "../../components/onboarding/RegisterOnboardingGuard";
import { SellerSiteHeader } from "../../components/layout/SellerSiteHeader";
import { SellerNavLink } from "../../components/navigation/SellerNavLink";
import { useSellerAuth } from "../../contexts/SellerAuthContext";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import { registerSellerAccount } from "../../services/sellerAccount";
import { formatCep } from "../../utils/viacep";
import { formatCnpj, formatCpf } from "../../utils/taxDocument";
import {
  loadOnboardingDraft,
  saveOnboardingDraft,
} from "../../utils/sellerOnboardingStorage";

export function SellerOnboardingReviewPage() {
  const { navigateWithFeedback, navigating } = useSellerNavigation();
  const { signIn } = useSellerAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const draft = loadOnboardingDraft();
  const document =
    draft.businessType === "company"
      ? formatCnpj(draft.taxDocument ?? "")
      : formatCpf(draft.taxDocument ?? "");
  const typeLabel = draft.businessType === "company" ? "Empresa (CNPJ)" : "Pessoa física (CPF)";
  const address = [
    draft.shippingStreet,
    draft.shippingNumber,
    draft.shippingComplement,
    draft.shippingNeighborhood,
    `${draft.shippingCity ?? ""}/${draft.shippingState ?? ""}`,
    formatCep(draft.shippingPostalCode ?? ""),
  ]
    .filter(Boolean)
    .join(", ");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (sending || navigating) return;
    setSending(true);
    setSubmitError(null);
    void registerSellerAccount(draft)
      .then((result) => {
        signIn({
          token: result.token,
          email: result.seller.email,
          sellerId: result.seller.id,
          storeName: result.seller.storeName,
          storeSlug: result.seller.storeSlug,
          status: result.seller.status,
        });
        saveOnboardingDraft({
          submittedAt: new Date().toISOString(),
          accountPassword: "",
        });
        void navigateWithFeedback("/register/submitted");
      })
      .catch((error: unknown) => {
        setSubmitError(
          error instanceof Error ? error.message : "Não foi possível enviar o cadastro."
        );
      })
      .finally(() => setSending(false));
  };

  return (
    <RegisterOnboardingGuard
      requireTerms
      requireCountry
      requireBusinessType
      requireAccount
      requireStore
      requireShipping
    >
      <div className="min-h-full bg-canvas">
        <SellerSiteHeader compact />
        <OnboardingShell
          progressPercent={100}
          title="Confira seus dados"
          description="Se algo estiver errado, volte na etapa correspondente antes de enviar."
          backTo="/register/shipping"
          footer={
            <button
              type="submit"
              form="seller-review-form"
              className={`button w-full sm:w-auto sm:min-w-[200px] ${
                navigating || sending ? "button-disabled" : "button-accent"
              }`}
              disabled={navigating || sending}
            >
              {sending ? "Enviando…" : "Enviar cadastro"}
            </button>
          }
        >
          <form id="seller-review-form" className="space-y-4" onSubmit={onSubmit}>
            <ReviewBlock title="Negócio" editTo="/register/business-type">
              <p>{typeLabel}</p>
              <p>{document}</p>
              <p>Brasil</p>
            </ReviewBlock>
            <ReviewBlock title="Acesso" editTo="/register/account">
              <p>{draft.accountEmail}</p>
              <p>Senha definida</p>
            </ReviewBlock>
            <ReviewBlock title="Loja" editTo="/register/store">
              <p>{draft.storeName}</p>
              <p>recoll.com.br/store/{draft.storeSlug}</p>
            </ReviewBlock>
            <ReviewBlock title="Envio" editTo="/register/shipping">
              <p>{address}</p>
            </ReviewBlock>
            {submitError ? <p className="error-legend">{submitError}</p> : null}
          </form>
        </OnboardingShell>
      </div>
    </RegisterOnboardingGuard>
  );
}

function ReviewBlock({
  title,
  editTo,
  children,
}: {
  title: string;
  editTo: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-edge px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-primary text-sm font-bold uppercase tracking-wide text-accent">{title}</h2>
        <SellerNavLink to={editTo} className="text-sm font-semibold text-title hover:text-accent">
          Editar
        </SellerNavLink>
      </div>
      <div className="mt-2 space-y-1 text-sm leading-6 text-text">{children}</div>
    </section>
  );
}