/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL?: string;
  readonly VITE_USER_APP_URL?: string;
  readonly VITE_LANDING_HERO_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
