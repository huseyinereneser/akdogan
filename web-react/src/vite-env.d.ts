/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * /admin panelinin parola kapısı. Sunucu olmadığı için istemci tarafında
   * karşılaştırılır — gerçek güvenlik sağlamaz, yalnızca caydırıcıdır.
   * Tanımlı değilse panel girişi tamamen kapalıdır.
   */
  readonly VITE_ADMIN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
