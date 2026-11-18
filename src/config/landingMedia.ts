/**
 * Hero da landing — foto via Unsplash (licença gratuita; atribuição em docs/IMAGE_ATTRIBUTION.md).
 * Outros marketplaces usam fotos próprias ou bancos licenciados; trocamos por arte Recoll quando houver.
 */
export const LANDING_HERO_IMAGE =
  import.meta.env.VITE_LANDING_HERO_URL?.trim() ||
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80";

export const LANDING_HERO_ATTRIBUTION = {
  photographer: "Alexandre Debieve",
  profileUrl: "https://unsplash.com/@firmbee",
  unsplashUrl: "https://unsplash.com/photos/person-using-macbook-pro-on-white-wooden-table-344FghzjajM",
};