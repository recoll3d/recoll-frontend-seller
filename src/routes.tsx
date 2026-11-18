import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useSellerAuth } from "./contexts/SellerAuthContext";
import { SellerDashboardPlaceholderPage } from "./pages/SellerDashboardPlaceholderPage";
import { SellerLandingPage } from "./pages/SellerLandingPage";
import { SellerLoginPlaceholderPage } from "./pages/SellerLoginPlaceholderPage";
import { SellerOnboardingPlaceholderPage } from "./pages/SellerOnboardingPlaceholderPage";
import { SellerOnboardingTermsPage } from "./pages/SellerOnboardingTermsPage";
import { SellerOnboardingBusinessTypePage } from "./pages/register/SellerOnboardingBusinessTypePage";
import { SellerOnboardingAccountPage } from "./pages/register/SellerOnboardingAccountPage";
import { SellerOnboardingCountryPage } from "./pages/register/SellerOnboardingCountryPage";
import { ProductApprovalPolicyPage } from "./pages/legal/ProductApprovalPolicyPage";

function SellerHomeRoute() {
  const { isAuthenticated } = useSellerAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <SellerLandingPage />;
}

function SellerGuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSellerAuth();
  const location = useLocation();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }
  return children;
}

function SellerAuthRequired({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSellerAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SellerHomeRoute />} />
      <Route
        path="/login"
        element={
          <SellerGuestOnly>
            <SellerLoginPlaceholderPage />
          </SellerGuestOnly>
        }
      />
      <Route
        path="/legal/product-approval-policy"
        element={<ProductApprovalPolicyPage />}
      />
      <Route path="/register/terms" element={<SellerOnboardingTermsPage />} />
      <Route path="/register/country" element={<SellerOnboardingCountryPage />} />
      <Route path="/register/business-type" element={<SellerOnboardingBusinessTypePage />} />
      <Route path="/register/account" element={<SellerOnboardingAccountPage />} />
      <Route
        path="/register/coming-soon"
        element={<SellerOnboardingPlaceholderPage />}
      />
      <Route
        path="/dashboard"
        element={
          <SellerAuthRequired>
            <SellerDashboardPlaceholderPage />
          </SellerAuthRequired>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
