import { SellerAuthProvider } from "./contexts/SellerAuthContext";
import { SellerNavigationProvider } from "./contexts/SellerNavigationContext";
import { ScrollToTop } from "./components/navigation/ScrollToTop";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <SellerAuthProvider>
      <SellerNavigationProvider>
        <ScrollToTop />
        <AppRoutes />
      </SellerNavigationProvider>
    </SellerAuthProvider>
  );
}
