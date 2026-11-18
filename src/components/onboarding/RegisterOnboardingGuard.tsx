import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import {
  hasAcceptedCurrentTerms,
  loadOnboardingDraft,
} from "../../utils/sellerOnboardingStorage";

type RegisterOnboardingGuardProps = {
  children: ReactNode;
  requireTerms?: boolean;
  requireCountry?: boolean;
  requireBusinessType?: boolean;
  requireAccount?: boolean;
  requireStore?: boolean;
};

export function RegisterOnboardingGuard({
  children,
  requireTerms = true,
  requireCountry = false,
  requireBusinessType = false,
  requireAccount = false,
  requireStore = false,
}: RegisterOnboardingGuardProps) {
  const d = loadOnboardingDraft();

  if (requireTerms && !hasAcceptedCurrentTerms(d)) {
    return <Navigate to="/register/terms" replace />;
  }
  if (requireCountry && d.country !== "BR") {
    return <Navigate to="/register/country" replace />;
  }
  if (requireBusinessType && (!d.businessType || !d.taxDocument)) {
    return <Navigate to="/register/business-type" replace />;
  }
  if (requireAccount && !d.accountEmail) {
    return <Navigate to="/register/account" replace />;
  }
  if (requireStore && (!d.storeName || !d.storeSlug)) {
    return <Navigate to="/register/store" replace />;
  }

  return children;
}