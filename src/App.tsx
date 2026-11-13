import { SellerAuthProvider } from "./contexts/SellerAuthContext";
import { SellerNavigationProvider } from "./contexts/SellerNavigationContext";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <SellerAuthProvider>
      <SellerNavigationProvider>
        <AppRoutes />
      </SellerNavigationProvider>
    </SellerAuthProvider>
  );
}
