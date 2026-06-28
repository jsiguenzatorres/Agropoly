// Analytics endpoints — accepts batched events from the client, exposes
// aggregated KPIs and a recent-event timeline for the dashboard.

import { Hono } from 'hono'
import { z } from 'zod'
import { insertEvents, analyticsSummary, recentEvents } from '../db'

const app = new Hono()

const eventSchema = z.object({
  ts:        z.number().int().positive(),
  sessionId: z.string().nullable().optional(),
  userName:  z.string().nullable().optional(),
  type:      z.string().min(1).max(64),
  payload:   z.record(z.unknown()).nullable().optional(),
})

const batchSchema = z.object({
  events: z.array(eventSchema).max(100),
})

// POST /api/analytics — batch insert events
app.post('/', async c => {
  let body: unknown
  try { body = await c.req.json() } catch { return c.json({ error: 'invalid json' }, 400) }
  const parsed = batchSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'invalid payload', details: parsed.error.format() }, 400)
  try {
    insertEvents(parsed.data.events)
    return c.json({ ok: true, count: parsed.data.events.length })
  } catch (err) {
    console.error('[analytics] insert failed:', err)
    return c.json({ error: 'insert failed' }, 500)
  }
})

// GET /api/analytics/summary?from=…&to=…
app.get('/summary', c => {
  const from = Number(c.req.query('from') ?? 0)
  const to   = Number(c.req.query('to')   ?? Date.now())
  if (Number.isNaN(from) || Number.isNaN(to)) return c.json({ error: 'invalid range' }, 400)
  return c.json(analyticsSummary(from, to))
})

// GET /api/analytics/events?from=…&to=…&limit=100
app.get('/events', c => {
  const from  = Number(c.req.query('from') ?? 0)
  const to    = Number(c.req.query('to')   ?? Date.now())
  const limit = Math.min(500, Math.max(1, Number(c.req.query('limit') ?? 100)))
  if (Number.isNaN(from) || Number.isNaN(to)) return c.json({ error: 'invalid range' }, 400)
  return c.json(recentEvents(from, to, limit))
})

export default app
