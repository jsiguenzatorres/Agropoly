// Historias del Campo BFA endpoints — public read, protected write.
// Admin auth via a single shared password (ADMIN_PASSWORD env), stored as a
// random session token in an httpOnly cookie. Sessions live in memory and
// expire after 24h — fine for this use case (a handful of BFA editors).

import { Hono } from 'hono'
import { z } from 'zod'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { getAllHistorias, getHistoria, updateHistoria } from '../db'

const app = new Hono()

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'agropoly-bfa-2026'  // dev default, override in prod
const COOKIE_NAME    = 'agropoly_admin'
const SESSION_MS     = 24 * 60 * 60 * 1000  // 24h

// In-memory session store. Restart loses sessions — admin re-logs in. Acceptable.
const sessions = new Map<string, number>()  // token → expiresAt

function isAdmin(token: string | undefined): boolean {
  if (!token) return false
  const exp = sessions.get(token)
  if (!exp || exp < Date.now()) {
    if (exp) sessions.delete(token)
    return false
  }
  return true
}

function randomToken(): string {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

// ─── Public reads ─────────────────────────────────────────────────────────

app.get('/', c => {
  try {
    return c.json({ historias: getAllHistorias() })
  } catch (err) {
    console.error('[historias] list failed:', err)
    return c.json({ error: 'failed to load' }, 500)
  }
})

app.get('/:mascotaId', c => {
  const h = getHistoria(c.req.param('mascotaId'))
  if (!h) return c.json({ error: 'not found' }, 404)
  return c.json(h)
})

// ─── Admin auth ───────────────────────────────────────────────────────────

const loginSchema = z.object({ password: z.string().min(1) })

app.post('/admin/login', async c => {
  let body: unknown
  try { body = await c.req.json() } catch { return c.json({ error: 'invalid json' }, 400) }
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'password required' }, 400)
  if (parsed.data.password !== ADMIN_PASSWORD) {
    // Constant-ish delay to slow brute force
    await new Promise(r => setTimeout(r, 600))
    return c.json({ error: 'invalid credentials' }, 401)
  }
  const token = randomToken()
  sessions.set(token, Date.now() + SESSION_MS)
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   SESSION_MS / 1000,
    path:     '/',
  })
  return c.json({ ok: true })
})

app.post('/admin/logout', c => {
  const token = getCookie(c, COOKIE_NAME)
  if (token) sessions.delete(token)
  deleteCookie(c, COOKIE_NAME, { path: '/' })
  return c.json({ ok: true })
})

app.get('/admin/me', c => {
  const token = getCookie(c, COOKIE_NAME)
  return c.json({ authenticated: isAdmin(token) })
})

// ─── Admin writes ─────────────────────────────────────────────────────────

const historiaSchema = z.object({
  mascotaId:        z.string().min(1).max(64),
  nombre:           z.string().max(80),
  rubro:            z.string().max(120),
  zona:             z.string().max(200),
  saludo:           z.string().max(500),
  origen:           z.string().max(2000),
  rubroDescripcion: z.string().max(2000),
  rubroStatLabel:   z.string().max(120),
  rubroStatValue:   z.string().max(120),
  rubroStatNote:    z.string().max(200),
  desafios:         z.array(z.string().max(200)).max(8),
  bfaProducto:      z.string().max(160),
  bfaDescripcion:   z.string().max(1000),
  retoJugador:      z.string().max(1000),
  pendingReview:    z.boolean(),
})

app.put('/:mascotaId', async c => {
  const token = getCookie(c, COOKIE_NAME)
  if (!isAdmin(token)) return c.json({ error: 'unauthorized' }, 401)
  const mascotaId = c.req.param('mascotaId')
  if (!getHistoria(mascotaId)) return c.json({ error: 'mascota not found' }, 404)
  let body: unknown
  try { body = await c.req.json() } catch { return c.json({ error: 'invalid json' }, 400) }
  const parsed = historiaSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'invalid payload', details: parsed.error.format() }, 400)
  if (parsed.data.mascotaId !== mascotaId) return c.json({ error: 'mascotaId mismatch' }, 400)
  try {
    updateHistoria(mascotaId, parsed.data)
    return c.json({ ok: true })
  } catch (err) {
    console.error('[historias] update failed:', err)
    return c.json({ error: 'update failed' }, 500)
  }
})

export default app
