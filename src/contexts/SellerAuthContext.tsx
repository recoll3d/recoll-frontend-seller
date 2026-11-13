import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "recoll.seller.session";

type SellerSession = {
  email: string;
  sellerId?: string;
};

type SellerAuthContextValue = {
  session: SellerSession | null;
  isAuthenticated: boolean;
  signInPlaceholder: (email: string) => void;
  signOut: () => void;
};

const SellerAuthContext = createContext<SellerAuthContextValue | null>(null);

function loadSession(): SellerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SellerSession;
  } catch {
    return null;
  }
}

export function SellerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SellerSession | null>(() => loadSession());

  const signInPlaceholder = useCallback((email: string) => {
    const next = { email: email.trim() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.email),
      signInPlaceholder,
      signOut,
    }),
    [session, signInPlaceholder, signOut]
  );

  return (
    <SellerAuthContext.Provider value={value}>{children}</SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  const ctx = useContext(SellerAuthContext);
  if (!ctx) {
    throw new Error("useSellerAuth must be used within SellerAuthProvider");
  }
  return ctx;
}
