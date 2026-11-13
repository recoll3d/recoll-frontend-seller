const DRAFT_KEY = "recoll.seller.onboarding.draft";

export type SellerOnboardingDraft = {
  acceptedTermsAt?: string;
  termsVersion: string;
};

export const TERMS_VERSION = "2025-11-13";

const DEFAULT_DRAFT: SellerOnboardingDraft = {
  termsVersion: TERMS_VERSION,
};

export function loadOnboardingDraft(): SellerOnboardingDraft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return { ...DEFAULT_DRAFT };
    return { ...DEFAULT_DRAFT, ...(JSON.parse(raw) as SellerOnboardingDraft) };
  } catch {
    return { ...DEFAULT_DRAFT };
  }
}

export function saveOnboardingDraft(patch: Partial<SellerOnboardingDraft>) {
  const next = { ...loadOnboardingDraft(), ...patch };
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
}

export function clearOnboardingDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}

export function hasAcceptedCurrentTerms(draft = loadOnboardingDraft()) {
  return (
    Boolean(draft.acceptedTermsAt) && draft.termsVersion === TERMS_VERSION
  );
}
