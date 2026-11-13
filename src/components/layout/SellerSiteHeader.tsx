import { Link, useNavigate } from "react-router-dom";

import { useSellerAuth } from "../../contexts/SellerAuthContext";

type SellerSiteHeaderProps = {
  compact?: boolean;
};

export function SellerSiteHeader({ compact }: SellerSiteHeaderProps) {
  const { isAuthenticated, signOut } = useSellerAuth();
  const navigate = useNavigate();

  return (
    <header
      className={`sticky top-0 z-30 border-b border-edge/60 bg-[var(--color-header-bg)] backdrop-blur-md ${
        compact ? "py-3" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-title">
          <img src="/recoll-icon.svg" alt="" width={36} height={36} className="rounded-full" />
          <span className="font-primary text-xl font-bold tracking-tight sm:text-2xl">
            Recoll <span className="text-accent">Vender</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="button button-outline hidden min-h-10 px-5 text-sm sm:inline-flex"
                onClick={() => navigate("/dashboard")}
              >
                Painel
              </button>
              <button
                type="button"
                className="button button-outline min-h-10 px-5 text-sm"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-semibold text-outline hover:text-title sm:inline"
              >
                Entrar
              </Link>
              <Link to="/register/terms" className="button button-accent min-h-10 px-5 text-sm">
                Começar a vender
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
