/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    ARTICLES_KV?: KVNamespace;
    ADMIN_PASSWORD?: string;
  }
}

export {};
