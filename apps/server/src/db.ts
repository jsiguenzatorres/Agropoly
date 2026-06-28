import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const DB_PATH = process.env.DB_PATH ?? './data/agropoly.db'
mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS game_sessions (
    id               TEXT PRIMARY KEY,
    started_at       INTEGER NOT NULL,
    ended_at         INTEGER NOT NULL,
    mode             TEXT NOT NULL,                 -- 'solo' | 'multi'
    educational_mode INTEGER NOT NULL DEFAULT 0,    -- 0 | 1
    turn_count       INTEGER NOT NULL,
    winner_name      TEXT
  );

  CREATE TABLE IF NOT EXISTS game_results (
    session_id      TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    rank            INTEGER NOT NULL,
    name            TEXT NOT NULL,
    token_id        TEXT NOT NULL,
    is_ai           INTEGER NOT NULL DEFAULT 0,
    balance_final   INTEGER NOT NULL,
    net_worth_final INTEGER NOT NULL,
    properties      INTEGER NOT NULL DEFAULT 0,
    houses          INTEGER NOT NULL DEFAULT 0,
    hotels          INTEGER NOT NULL DEFAULT 0,
    bankrupt        INTEGER NOT NULL DEFAULT 0,
    is_winner       INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (session_id, rank)
  );

  CREATE INDEX IF NOT EXISTS idx_results_name      ON game_results(name);
  CREATE INDEX IF NOT EXISTS idx_results_winner    ON game_results(is_winner);
  CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON game_sessions(ended_at);
`)

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SessionRecord {
  id: string
  startedAt: number
  endedAt: number
  mode: 'solo' | 'multi'
  educationalMode: boolean
  turnCount: number
  winnerName: string | null
}

export interface ResultRecord {
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
}

export interface SaveSessionInput {
  session: SessionRecord
  results: ResultRecord[]
}

// ─── Statements ────────────────────────────────────────────────────────────

const insertSession = db.prepare(`
  INSERT OR REPLACE INTO game_sessions
    (id, started_at, ended_at, mode, educational_mode, turn_count, winner_name)
  VALUES
    (@id, @startedAt, @endedAt, @mode, @educationalMode, @turnCount, @winnerName)
`)

const insertResult = db.prepare(`
  INSERT OR REPLACE INTO game_results
    (session_id, rank, name, token_id, is_ai, balance_final, net_worth_final,
     properties, houses, hotels, bankrupt, is_winner)
  VALUES
    (@sessionId, @rank, @name, @tokenId, @isAI, @balanceFinal, @netWorthFinal,
     @properties, @houses, @hotels, @bankrupt, @isWinner)
`)

export const saveSession = db.transaction((input: SaveSessionInput) => {
  insertSession.run({
    id:              input.session.id,
    startedAt:       input.session.startedAt,
    endedAt:         input.session.endedAt,
    mode:            input.session.mode,
    educationalMode: input.session.educationalMode ? 1 : 0,
    turnCount:       input.session.turnCount,
    winnerName:      input.session.winnerName,
  })
  for (const r of input.results) {
    insertResult.run({
      sessionId:     input.session.id,
      rank:          r.rank,
      name:          r.name,
      tokenId:       r.tokenId,
      isAI:          r.isAI ? 1 : 0,
      balanceFinal:  r.balanceFinal,
      netWorthFinal: r.netWorthFinal,
      properties:    r.properties,
      houses:        r.houses,
      hotels:        r.hotels,
      bankrupt:      r.bankrupt ? 1 : 0,
      isWinner:      r.isWinner ? 1 : 0,
    })
  }
})

// ─── Leaderboard ───────────────────────────────────────────────────────────

const leaderboardQuery = db.prepare(`
  SELECT
    name,
    COUNT(*)                                       AS games,
    SUM(is_winner)                                 AS wins,
    SUM(CASE WHEN is_winner = 0 THEN 1 ELSE 0 END) AS losses,
    ROUND(AVG(net_worth_final))                    AS avg_net_worth,
    MAX(net_worth_final)                           AS best_net_worth,
    SUM(houses)                                    AS total_houses,
    SUM(hotels)                                    AS total_hotels
  FROM game_results
  WHERE is_ai = 0
  GROUP BY name
  ORDER BY wins DESC, avg_net_worth DESC
  LIMIT @limit
`)

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

export function leaderboard(limit = 20): LeaderboardEntry[] {
  return leaderboardQuery.all({ limit }) as LeaderboardEntry[]
}

const recentSessionsQuery = db.prepare(`
  SELECT id, ended_at, mode, turn_count, winner_name
  FROM game_sessions
  ORDER BY ended_at DESC
  LIMIT @limit
`)

export interface RecentSession {
  id: string
  ended_at: number
  mode: string
  turn_count: number
  winner_name: string | null
}

export function recentSessions(limit = 10): RecentSession[] {
  return recentSessionsQuery.all({ limit }) as RecentSession[]
}
