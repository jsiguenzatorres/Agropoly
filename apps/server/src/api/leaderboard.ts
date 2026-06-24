import { Hono } from 'hono'

const app = new Hono()

app.get('/', async c => {
  // TODO: query Supabase leaderboard view
  return c.json({ leaderboard: [], message: 'Not yet implemented' })
})

export default app
