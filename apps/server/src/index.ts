import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { Server } from 'colyseus'
import type { Server as HttpServer } from 'http'
import voiceRoutes       from './api/voice'
import educationRoutes   from './api/education'
import leaderboardRoutes from './api/leaderboard'
import sessionsRoutes    from './api/sessions'
import { GameRoom }      from './rooms/GameRoom'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({ origin: process.env.WEB_URL ?? 'http://localhost:5173' }))

app.get('/health', c => c.json({ status: 'ok', service: 'agropoly-server' }))

app.route('/api/voice',       voiceRoutes)
app.route('/api/education',   educationRoutes)
app.route('/api/leaderboard', leaderboardRoutes)
app.route('/api/sessions',    sessionsRoutes)

const PORT = Number(process.env.PORT ?? 2567)

// Hono creates its own http.Server; Colyseus attaches WebSocket upgrades to it
const httpServer = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\n🌾 AGROPOLY BFA Server running on port ${PORT}\n`)
})

const gameServer = new Server({ server: httpServer as unknown as HttpServer })
gameServer.define('game_room', GameRoom)
