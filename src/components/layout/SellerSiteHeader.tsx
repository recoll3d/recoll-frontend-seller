import { SellerNavLink } from "../navigation/SellerNavLink";
import { useSellerAuth } from "../../contexts/SellerAuthContext";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";

type SellerSiteHeaderProps = {
  compact?: boolean;
};

export function SellerSiteHeader({ compact }: SellerSiteHeaderProps) {
  const { isAuthenticated, signOut } = useSellerAuth();
  const { navigateWithFeedback } = useSellerNavigation();

  return (
    <header
      className={`sticky top-0 z-30 border-b border-edge/60 bg-[var(--color-header-bg)] backdrop-blur-md ${
        compact ? "py-3" : "py-4"
      }`}
    >
      <div className="seller-site-x seller-header-row mx-auto flex w-full items-center justify-between gap-1.5 max-[380px]:px-2 sm:gap-4">
        <SellerNavLink
          to="/"
          className="-ml-0.5 flex shrink-0 items-center gap-3 sm:gap-2 lg:-ml-1"
          aria-label="Recoll"
        >
          <img src="/recoll-icon.svg" alt="" className="h-6 w-6" />
          <img src="/recoll-wordmark.svg" alt="Recoll" className="h-3.5 w-auto" />
        </SellerNavLink>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <button
              type="button"
              className="button button-outline min-h-10 px-5 text-sm"
              onClick={() => {
                signOut();
                void navigateWithFeedback("/");
              }}
            >
              Sair
            </button>
          ) : (
            <>
              <SellerNavLink
                to="/login"
                className="shrink-0 text-sm font-semibold text-outline hover:text-title"
              >
                Entrar
              </SellerNavLink>
              <SellerNavLink
                to="/register/terms"
                className="button button-accent seller-header-cta"
              >
                Começar a vender
              </SellerNavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
