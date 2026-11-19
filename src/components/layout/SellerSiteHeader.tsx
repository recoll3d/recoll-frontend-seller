import { SellerNavLink } from "../navigation/SellerNavLink";
import { useSellerAuth } from "../../contexts/SellerAuthContext";
import { useSellerNavigation } from "../../contexts/SellerNavigationContext";

type SellerSiteHeaderProps = {
  compact?: boolean;
  rail?: boolean;
};

export function SellerSiteHeader({ compact, rail }: SellerSiteHeaderProps) {
  const { isAuthenticated, signOut } = useSellerAuth();
  const { navigateWithFeedback } = useSellerNavigation();

  return (
    <header
      className={`sticky top-0 z-30 border-b border-edge/60 bg-[var(--color-header-bg)] backdrop-blur-md ${
        compact ? "py-3" : "py-4"
      }`}
    >
      <div
        className={
          rail
            ? "flex w-full items-center justify-between gap-4 pl-5 pr-4 sm:pr-8 lg:pr-12"
            : "seller-site-x seller-header-row mx-auto flex w-full items-center justify-between gap-1.5 max-[380px]:px-2 sm:gap-4"
        }
      >
        <SellerNavLink
          to="/"
          className={
            rail
              ? "flex shrink-0 items-center gap-3 sm:gap-2"
              : "-ml-0.5 flex shrink-0 items-center gap-3 sm:gap-2 lg:-ml-1"
          }
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
