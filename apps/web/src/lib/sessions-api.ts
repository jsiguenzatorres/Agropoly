import { getNetWorth, HOTEL_LEVEL } from '@agropoly/game-engine'
import type { GameState } from '@agropoly/game-engine'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:2567'

interface SessionPayload {
  session: {
    id: string
    startedAt: number
    endedAt: number
    mode: 'solo' | 'multi'
    educationalMode: boolean
    turnCount: number
    winnerName: string | null
  }
  results: Array<{
    rank: number
    name: string
    tokenId: string
    isAI: boolean
    balanceFinal: number
    netWorthFinal: number
    properties: number
    houses: number
    hotels: number
    bankrupt: boolean
    isWinner: boolean
  }>
}

function buildPayload(game: GameState, sessionId: string, startedAt: number): SessionPayload {
  const winner = game.players.find(p => p.id === game.winner)
  const stats = game.players.map(p => {
    let properties = 0, houses = 0, hotels = 0
    game.board.forEach(sp => {
      if (sp.ownerId !== p.id) return
      properties++
      const lvl = sp.buildings ?? 0
      if (lvl >= HOTEL_LEVEL) hotels++
      else if (lvl > 0) houses += lvl
    })
    return {
      player: p,
      netWorth: getNetWorth(p, game.board),
      properties, houses, hotels,
    }
  }).sort((a, b) => b.netWorth - a.netWorth)

  return {
    session: {
      id:              sessionId,
      startedAt,
      endedAt:         Date.now(),
      mode:            'solo',
      educationalMode: game.educationalMode,
      turnCount:       game.turnCount,
      winnerName:      winner?.name ?? null,
    },
    results: stats.map((s, i) => ({
      rank:          i + 1,
      name:          s.player.name,
      tokenId:       s.player.tokenId,
      isAI:          s.player.isAI,
      balanceFinal:  s.player.balance,
      netWorthFinal: s.netWorth,
      properties:    s.properties,
      houses:        s.houses,
      hotels:        s.hotels,
      bankrupt:      s.player.bankrupt,
      isWinner:      s.player.id === game.winner,
    })),
  }
}

export async function postSoloSession(game: GameState, sessionId: string, startedAt: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(game, sessionId, startedAt)),
    })
    return res.ok
  } catch {
    return false  // server down — fail silently, the session just isn't recorded
  }
}

export interface LeaderboardEntry {
  name: string
  games: number
  wins: number
  losses: number
  avg_net_worth: number
  best_net_worth: number
  total_houses: number
  total_hotels: number
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard?limit=${limit}`)
    if (!res.ok) return []
    const data = await res.json() as { leaderboard: LeaderboardEntry[] }
    return data.leaderboard ?? []
  } catch {
    return []
  }
}
