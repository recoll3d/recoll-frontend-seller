import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, type NavigateOptions, type To } from "react-router-dom";
import { PiCircleDashedBold } from "react-icons/pi";

/** Tempo mínimo visível — alinhado ao app do usuário (~2,6s na splash), mais curto mas perceptível. */
const MIN_OVERLAY_MS = 1100;
const FADE_OUT_MS = 380;

type SellerNavigationContextValue = {
  navigating: boolean;
  navigateWithFeedback: (to: To, options?: NavigateOptions) => Promise<void>;
};

const SellerNavigationContext = createContext<SellerNavigationContextValue | null>(
  null
);

export function SellerNavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "loading" | "exit">("idle");

  const navigateWithFeedback = useCallback(
    async (to: To, options?: NavigateOptions) => {
      if (phase !== "idle") return;
      setPhase("loading");
      const started = Date.now();
      navigate(to, options);
      const elapsed = Date.now() - started;
      const hold = Math.max(0, MIN_OVERLAY_MS - elapsed);
      if (hold > 0) {
        await new Promise((resolve) => setTimeout(resolve, hold));
      }
      setPhase("exit");
      await new Promise((resolve) => setTimeout(resolve, FADE_OUT_MS));
      setPhase("idle");
    },
    [navigate, phase]
  );

  const value = useMemo(
    () => ({
      navigating: phase !== "idle",
      navigateWithFeedback,
    }),
    [phase, navigateWithFeedback]
  );

  const showOverlay = phase !== "idle";
  const exiting = phase === "exit";

  return (
    <SellerNavigationContext.Provider value={value}>
      {children}
      {showOverlay ? (
        <div
          className={`seller-nav-overlay ${exiting ? "seller-nav-overlay--exit" : ""}`}
          role="status"
          aria-live="polite"
          aria-label="Carregando"
        >
          <div className="flex flex-col items-center gap-4">
            <PiCircleDashedBold className="seller-nav-spinner text-5xl text-accent" />
            <p className="text-sm font-semibold text-title">Carregando…</p>
          </div>
        </div>
      ) : null}
    </SellerNavigationContext.Provider>
  );
}

export function useSellerNavigation() {
  const ctx = useContext(SellerNavigationContext);
  if (!ctx) {
    throw new Error("useSellerNavigation must be used within SellerNavigationProvider");
  }
  return ctx;
}