// Sentry init (no-op when VITE_SENTRY_DSN is missing — safe to deploy without).
// Activate by setting VITE_SENTRY_DSN in apps/web/.env.local
import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
  })
}
