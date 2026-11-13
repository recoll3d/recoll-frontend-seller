import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, type NavigateOptions, type To } from "react-router-dom";
import { PiCircleDashedBold } from "react-icons/pi";

const MIN_TRANSITION_MS = 420;

type SellerNavigationContextValue = {
  navigating: boolean;
  navigateWithFeedback: (to: To, options?: NavigateOptions) => Promise<void>;
};

const SellerNavigationContext = createContext<SellerNavigationContextValue | null>(
  null
);

export function SellerNavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigating, setNavigating] = useState(false);
  const routeKeyRef = useRef(location.key);

  useEffect(() => {
    if (location.key !== routeKeyRef.current) {
      routeKeyRef.current = location.key;
      setNavigating(false);
    }
  }, [location.key]);

  const navigateWithFeedback = useCallback(
    async (to: To, options?: NavigateOptions) => {
      setNavigating(true);
      const started = Date.now();
      navigate(to, options);
      const elapsed = Date.now() - started;
      const wait = Math.max(0, MIN_TRANSITION_MS - elapsed);
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    },
    [navigate]
  );

  const value = useMemo(
    () => ({ navigating, navigateWithFeedback }),
    [navigating, navigateWithFeedback]
  );

  return (
    <SellerNavigationContext.Provider value={value}>
      {children}
      {navigating ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas/75 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Carregando"
        >
          <PiCircleDashedBold className="animate-spin text-5xl text-accent" />
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
