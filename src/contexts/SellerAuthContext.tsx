import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "recoll.seller.session";

export type SellerSession = {
  token: string;
  email: string;
  sellerId: string;
  storeName: string;
  storeSlug: string;
  status: string;
};

type SellerAuthContextValue = {
  session: SellerSession | null;
  isAuthenticated: boolean;
  signIn: (session: SellerSession) => void;
  signOut: () => void;
};

const SellerAuthContext = createContext<SellerAuthContextValue | null>(null);

function loadSession(): SellerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SellerSession>;
    if (!parsed.token || !parsed.email || !parsed.sellerId) return null;
    return {
      token: parsed.token,
      email: parsed.email,
      sellerId: parsed.sellerId,
      storeName: parsed.storeName ?? "",
      storeSlug: parsed.storeSlug ?? "",
      status: parsed.status ?? "pending_approval",
    };
  } catch {
    return null;
  }
}

export function SellerAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SellerSession | null>(() => loadSession());

  const signIn = useCallback((next: SellerSession) => {
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
      isAuthenticated: Boolean(session?.token && session.email),
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
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
