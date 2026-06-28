// Lightweight analytics client — buffers events in memory + localStorage, flushes
// every 5s or every 20 events to /api/analytics. Survives page reloads via
// localStorage. Non-blocking: track() never throws.
//
// Usage:
//   import { track, setAnalyticsContext } from './lib/analytics'
//   setAnalyticsContext({ sessionId: 'sol-123', userName: 'Josué' })
//   track('game_started', { mode: 'solo', eduMode: true, players: 3 })

const API_URL    = (import.meta.env.VITE_API_URL ?? 'http://localhost:2567') + '/api/analytics'
const STORAGE_KEY = 'agropoly:analytics:queue'
const MAX_BUFFER  = 20
const FLUSH_MS    = 5000
const MAX_RETRY   = 3

export interface AnalyticsEvent {
  ts:         number
  sessionId?: string | null
  userName?:  string | null
  type:       string
  payload?:   Record<string, unknown> | null
}

let context: { sessionId?: string | null; userName?: string | null } = {}
let buffer:  AnalyticsEvent[] = []
let timer:   ReturnType<typeof setTimeout> | null = null
let retries = 0

// Restore unflushed events from a previous session on startup
try {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    buffer = JSON.parse(stored)
    persistBuffer()
    scheduleFlush()
  }
} catch { /* localStorage may be unavailable */ }

function persistBuffer() {
  try {
    if (buffer.length === 0) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(buffer))
  } catch { /* quota or disabled */ }
}

function scheduleFlush() {
  if (timer) return
  timer = setTimeout(() => {
    timer = null
    void flush()
  }, FLUSH_MS)
}

export function setAnalyticsContext(ctx: { sessionId?: string | null; userName?: string | null }) {
  context = { ...context, ...ctx }
}

export function track(type: string, payload?: Record<string, unknown>) {
  const event: AnalyticsEvent = {
    ts:        Date.now(),
    sessionId: context.sessionId ?? null,
    userName:  context.userName ?? null,
    type,
    payload:   payload ?? null,
  }
  buffer.push(event)
  persistBuffer()
  if (buffer.length >= MAX_BUFFER) {
    void flush()
  } else {
    scheduleFlush()
  }
}

export async function flush(): Promise<boolean> {
  if (buffer.length === 0) return true
  const batch = buffer.slice(0, 100)
  try {
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ events: batch }),
      keepalive: true,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    buffer = buffer.slice(batch.length)
    persistBuffer()
    retries = 0
    return true
  } catch (err) {
    retries++
    if (retries < MAX_RETRY) {
      // Exponential backoff
      setTimeout(() => { void flush() }, 1000 * 2 ** retries)
    } else {
      console.warn('[analytics] flush failed after retries — events kept in queue', err)
      retries = 0
    }
    return false
  }
}

// Flush on page unload using sendBeacon (survives navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (buffer.length === 0) return
    const batch = buffer.slice(0, 100)
    try {
      const blob = new Blob([JSON.stringify({ events: batch })], { type: 'application/json' })
      navigator.sendBeacon(API_URL, blob)
      buffer = buffer.slice(batch.length)
      persistBuffer()
    } catch { /* ignored on unload */ }
  })
}

// Dev helper
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as unknown as { __analytics: object }).__analytics = {
    flush,
    buffer: () => [...buffer],
    context: () => ({ ...context }),
  }
}
