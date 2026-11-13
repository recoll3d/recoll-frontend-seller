import { SellerAuthProvider } from "./contexts/SellerAuthContext";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <SellerAuthProvider>
      <AppRoutes />
    </SellerAuthProvider>
  );
}
