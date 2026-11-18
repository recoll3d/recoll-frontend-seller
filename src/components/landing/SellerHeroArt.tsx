/** Ilustração SVG Recoll (seção “Painel”) — arte própria, sem stock. */
export function SellerHeroArt() {
  return (
    <div
      className="relative flex h-full min-h-[280px] w-full items-center justify-center overflow-hidden sm:min-h-[360px] lg:min-h-[420px] lg:flex-1"
      aria-hidden
    >
      <div className="seller-hero-art absolute inset-0" />
      <svg
        className="relative z-[1] h-[72%] w-[85%] max-w-md drop-shadow-[0_24px_48px_rgba(5,242,131,0.15)]"
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="48" y="72" width="200" height="140" rx="16" fill="#151c28" stroke="#2d3748" />
        <rect x="68" y="96" width="120" height="12" rx="4" fill="#05f283" fillOpacity="0.85" />
        <rect x="68" y="118" width="160" height="8" rx="4" fill="#3d4d63" />
        <rect x="68" y="134" width="140" height="8" rx="4" fill="#3d4d63" />
        <rect x="68" y="168" width="72" height="28" rx="8" fill="#04c168" />
        <path
          d="M248 108L340 88V232L248 252V108Z"
          fill="#121a26"
          stroke="#05f283"
          strokeWidth="2"
        />
        <circle cx="294" cy="170" r="36" fill="#05f283" fillOpacity="0.2" />
        <path
          d="M278 170L290 182L312 158"
          stroke="#05f283"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="120" cy="248" r="48" fill="#05f283" fillOpacity="0.12" />
        <circle cx="320" cy="56" r="32" fill="#05f283" fillOpacity="0.08" />
      </svg>
    </div>
  );
}