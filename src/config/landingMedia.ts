/**
 * Fotos via Pexels (licença gratuita — uso comercial sem atribuição obrigatória).
 * Sobrescreva com VITE_LANDING_HERO_URL / VITE_LANDING_WORK_URL se quiser hospedar localmente.
 */
const pexels = (id: number, w: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&dpr=2`;

export const LANDING_HERO_IMAGE =
  import.meta.env.VITE_LANDING_HERO_URL?.trim() || pexels(4065156, 1400);

export const LANDING_PLATFORM_IMAGE =
  import.meta.env.VITE_LANDING_PLATFORM_URL?.trim() || pexels(6169665, 1200);

export const LANDING_WORK_IMAGE =
  import.meta.env.VITE_LANDING_WORK_URL?.trim() || pexels(7688336, 1200);