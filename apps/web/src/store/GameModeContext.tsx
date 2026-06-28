import { createContext, useContext, type ReactNode } from 'react'
import { useGameStore } from './gameStore'
import { useMultiplayerStore } from './multiplayerStore'
import type { GameState, BoardSpace } from '@agropoly/game-engine'

export type GameMode = 'solo' | 'multi'

const GameModeContext = createContext<GameMode>('solo')

export function GameModeProvider({ mode, children }: { mode: GameMode; children: ReactNode }) {
  return <GameModeContext.Provider value={mode}>{children}</GameModeContext.Provider>
}

export function useGameMode(): GameMode {
  return useContext(GameModeContext)
}

// ── Selector hooks: pick from the right store based on context ──────────────

export function useActiveGame(): GameState | null {
  const mode = useGameMode()
  const solo  = useGameStore(s => s.game)
  const multi = useMultiplayerStore(s => s.game)
  return mode === 'multi' ? multi : solo
}

export function useActiveBoardSpace(id: number): BoardSpace | undefined {
  const mode = useGameMode()
  const solo  = useGameStore(s => s.game?.board[id])
  const multi = useMultiplayerStore(s => s.game?.board[id])
  return mode === 'multi' ? multi : solo
}

export function useActivePlayers() {
  const mode = useGameMode()
  const solo  = useGameStore(s => s.game?.players)
  const multi = useMultiplayerStore(s => s.game?.players)
  return mode === 'multi' ? multi : solo
}

export function useActiveCurrentIdx(): number {
  const mode = useGameMode()
  const solo  = useGameStore(s => s.game?.currentPlayerIndex ?? 0)
  const multi = useMultiplayerStore(s => s.game?.currentPlayerIndex ?? 0)
  return mode === 'multi' ? multi : solo
}

// gameId / setMoving are solo-only concepts; in multi they're no-ops
export function useActiveGameId(): number {
  return useGameStore(s => s.gameId)
}
export function useActiveSetMoving() {
  const mode = useGameMode()
  const solo = useGameStore(s => s.setMoving)
  // In multi we don't have an animation lock to gate UI on
  return mode === 'multi' ? (_: boolean) => {} : solo
}
