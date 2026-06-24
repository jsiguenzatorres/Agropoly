import { Hono } from 'hono'

const app = new Hono()

app.post('/lesson', async c => {
  // TODO: Claude claude-sonnet-4-6 generates lesson for concept
  return c.json({ lesson: null, message: 'Not yet implemented' })
})

app.post('/analyze', async c => {
  // TODO: Claude claude-opus-4-6 analyzes player behavior
  return c.json({ analysis: null, message: 'Not yet implemented' })
})

export default app
