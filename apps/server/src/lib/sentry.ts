// Sentry init (no-op when SENTRY_DSN is missing).
// Activate by setting SENTRY_DSN in apps/server/.env
import * as Sentry from '@sentry/node'

export function initSentry() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 0.1,
  })
}
