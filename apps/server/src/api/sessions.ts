import { Hono } from 'hono'
import { saveSession, type SaveSessionInput } from '../db'

const app = new Hono()

function isValidPayload(body: unknown): body is SaveSessionInput {
  if (!body || typeof body !== 'object') return false
  const b = body as { session?: unknown; results?: unknown }
  if (!b.session || typeof b.session !== 'object') return false
  if (!Array.isArray(b.results)) return false
  const s = b.session as Record<string, unknown>
  return typeof s.id === 'string'
      && typeof s.startedAt === 'number'
      && typeof s.endedAt === 'number'
      && (s.mode === 'solo' || s.mode === 'multi')
      && typeof s.turnCount === 'number'
}

app.post('/', async c => {
  const body = await c.req.json().catch(() => null)
  if (!isValidPayload(body)) {
    return c.json({ error: 'invalid payload' }, 400)
  }
  // Reject room IDs starting with our multi prefix to avoid client spoofing — only allow
  // solo mode coming from clients here
  if (body.session.mode === 'multi') {
    return c.json({ error: 'multi sessions are persisted server-side, not via HTTP' }, 403)
  }
  try {
    saveSession(body)
    return c.json({ ok: true, id: body.session.id })
  } catch (e) {
    return c.json({ error: (e as Error).message }, 500)
  }
})

export default app
