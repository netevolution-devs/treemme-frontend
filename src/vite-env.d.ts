/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API: string
  readonly VITE_PUBLIC_BASE_URL: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly url: string
}