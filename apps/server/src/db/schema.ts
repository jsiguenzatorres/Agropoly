// Drizzle ORM schema mirroring the existing SQLite tables.
// Kept in parallel with the raw-SQL approach in db.ts for incremental migration.

import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const gameSessions = sqliteTable('game_sessions', {
  id:              text('id').primaryKey(),
  startedAt:       integer('started_at').notNull(),
  endedAt:         integer('ended_at').notNull(),
  mode:            text('mode', { enum: ['solo', 'multi'] }).notNull(),
  educationalMode: integer('educational_mode', { mode: 'boolean' }).notNull().default(false),
  turnCount:       integer('turn_count').notNull(),
  winnerName:      text('winner_name'),
})

export const gameResults = sqliteTable('game_results', {
  sessionId:     text('session_id').notNull().references(() => gameSessions.id, { onDelete: 'cascade' }),
  rank:          integer('rank').notNull(),
  name:          text('name').notNull(),
  tokenId:       text('token_id').notNull(),
  isAI:          integer('is_ai', { mode: 'boolean' }).notNull().default(false),
  balanceFinal:  integer('balance_final').notNull(),
  netWorthFinal: integer('net_worth_final').notNull(),
  properties:    integer('properties').notNull().default(0),
  houses:        integer('houses').notNull().default(0),
  hotels:        integer('hotels').notNull().default(0),
  bankrupt:      integer('bankrupt', { mode: 'boolean' }).notNull().default(false),
  isWinner:      integer('is_winner', { mode: 'boolean' }).notNull().default(false),
}, (t) => ({
  pk: primaryKey({ columns: [t.sessionId, t.rank] }),
}))

export type NewGameSession = typeof gameSessions.$inferInsert
export type NewGameResult  = typeof gameResults.$inferInsert
