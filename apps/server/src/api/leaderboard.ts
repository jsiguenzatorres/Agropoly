import { Hono } from 'hono'
import { leaderboard, recentSessions } from '../db'

const app = new Hono()

app.get('/', c => {
  const limit = Math.min(100, Math.max(1, Number(c.req.query('limit') ?? 20)))
  return c.json({ leaderboard: leaderboard(limit) })
})

app.get('/recent', c => {
  const limit = Math.min(50, Math.max(1, Number(c.req.query('limit') ?? 10)))
  return c.json({ sessions: recentSessions(limit) })
})

export default app
