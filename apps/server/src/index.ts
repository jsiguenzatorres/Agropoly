import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { createServer } from 'http'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({ origin: process.env.WEB_URL ?? 'http://localhost:5173' }))

app.get('/health', c => c.json({ status: 'ok', service: 'agropoly-server' }))

// API routes
app.route('/api/voice', (await import('./api/voice')).default)
app.route('/api/education', (await import('./api/education')).default)
app.route('/api/leaderboard', (await import('./api/leaderboard')).default)

const httpServer = createServer()
const gameServer = new Server({ server: httpServer })

// Colyseus rooms
const { GameRoom } = await import('./rooms/GameRoom')
gameServer.define('game_room', GameRoom)

app.use('/colyseus', monitor())

const PORT = Number(process.env.PORT ?? 2567)

httpServer.listen(PORT, () => {
  console.log(`\n🌾 AGROPOLY BFA Server running on port ${PORT}`)
  console.log(`   Colyseus monitor: http://localhost:${PORT}/colyseus\n`)
})
