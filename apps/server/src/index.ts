import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Server } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { createServer } from 'http'
import voiceRoutes       from './api/voice'
import educationRoutes   from './api/education'
import leaderboardRoutes from './api/leaderboard'
import { GameRoom }      from './rooms/GameRoom'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({ origin: process.env.WEB_URL ?? 'http://localhost:5173' }))

app.get('/health', c => c.json({ status: 'ok', service: 'agropoly-server' }))

app.route('/api/voice',       voiceRoutes)
app.route('/api/education',   educationRoutes)
app.route('/api/leaderboard', leaderboardRoutes)

const httpServer = createServer()
const gameServer = new Server({ server: httpServer })

gameServer.define('game_room', GameRoom)

app.use('/colyseus', monitor())

const PORT = Number(process.env.PORT ?? 2567)

httpServer.listen(PORT, () => {
  console.log(`\n🌾 AGROPOLY BFA Server running on port ${PORT}`)
  console.log(`   Colyseus monitor: http://localhost:${PORT}/colyseus\n`)
})
