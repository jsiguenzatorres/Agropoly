import { Hono } from 'hono'

const app = new Hono()

// POST /api/voice/generate
// Body: { mascot: string, text: string, emotion: string }
app.post('/generate', async c => {
  const { mascot, text, emotion = 'neutral' } = await c.req.json()

  if (!mascot || !text) {
    return c.json({ error: 'mascot and text are required' }, 400)
  }

  // TODO: implement ElevenLabs + Supabase Storage cache
  // See: AGROPOLY-REACT-Dev-Guide.md — PROMPT F3.2
  return c.json({
    url: '',
    cached: false,
    duration: 0,
    message: 'Voice generation not yet implemented',
  })
})

export default app
