const USER_APP_URL =
  import.meta.env.VITE_USER_APP_URL?.replace(/\/$/, "") ?? "https://re-coll.vercel.app";

export function SellerSiteFooter() {
  return (
    <footer className="border-t border-edge bg-[#0a0e14] px-4 py-8 text-center text-xs text-text sm:px-6">
      <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
        <a
          href={USER_APP_URL}
          className="text-text hover:text-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          Loja Recoll
        </a>
        <a href="/legal/product-approval-policy" className="text-text hover:text-accent">
          Política de aprovação
        </a>
      </nav>
      <p className="opacity-70">© {new Date().getFullYear()} Recoll</p>
    </footer>
  );
}