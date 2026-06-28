import { useGameStore } from './gameStore'
import { useMultiplayerStore } from './multiplayerStore'
import type { PendingAction, AuctionState } from './gameStore'
import type { GameState, Card } from '@agropoly/game-engine'

export interface GameSource {
  mode: 'solo' | 'multi'
  // State
  game:           GameState | null
  pending:        PendingAction
  lastDice:       { d1: number; d2: number; doubles: boolean } | null
  pendingCard:    Card | null
  pendingAmount:  number
  isMoving:       boolean              // only meaningful in solo (server has no animation lock)
  // Multi-only
  mySessionId?:   string

  // Actions
  rollDice:     () => void
  confirmBuy:   () => void
  skipBuy:      () => void
  confirmRent:  () => void
  confirmTax:   () => void
  drawCard:     () => void
  applyCard:    () => void
  payJailFine:  () => void
  rollForJail:  () => void
  endTurn:      () => void
  build:        (spaceId: number) => void
  sellBuilding: (spaceId: number) => void
  mortgage:     (spaceId: number) => void
  unmortgage:   (spaceId: number) => void
  placeBid:     (amount: number) => void
  passAuction:  () => void
  auction:      AuctionState | null
  reset:        () => void
}

export function useGameSource(mode: 'solo' | 'multi'): GameSource {
  // Both hooks always called (Rules of Hooks). Read both, return one.
  const solo  = useGameStore()
  const multi = useMultiplayerStore()

  if (mode === 'multi') {
    return {
      mode: 'multi',
      game:          multi.game,
      pending:       multi.pending,
      lastDice:      multi.lastDice,
      pendingCard:   multi.pendingCard,
      pendingAmount: multi.pendingAmount,
      isMoving:      false,
      mySessionId:   multi.mySessionId,
      rollDice:      multi.rollDice,
      confirmBuy:    multi.confirmBuy,
      skipBuy:       multi.skipBuy,
      confirmRent:   multi.confirmRent,
      confirmTax:    multi.confirmTax,
      drawCard:      multi.drawCard,
      applyCard:     multi.applyCard,
      payJailFine:   multi.payJailFine,
      rollForJail:   multi.rollForJail,
      endTurn:       multi.endTurn,
      build:         multi.build,
      sellBuilding:  multi.sellBuilding,
      mortgage:      multi.mortgage,
      unmortgage:    multi.unmortgage,
      placeBid:      multi.placeBid,
      passAuction:   multi.passAuction,
      auction:       multi.auction,
      reset:         multi.disconnect,
    }
  }
  return {
    mode: 'solo',
    game:          solo.game,
    pending:       solo.pending,
    lastDice:      solo.lastDice,
    pendingCard:   solo.pendingCard,
    pendingAmount: solo.pendingAmount,
    isMoving:      solo.isMoving,
    rollDice:      solo.rollDice,
    confirmBuy:    solo.confirmBuy,
    skipBuy:       solo.skipBuy,
    confirmRent:   solo.confirmRent,
    confirmTax:    solo.confirmTax,
    drawCard:      solo.drawCard,
    applyCard:     solo.applyCard,
    payJailFine:   solo.payJailFine,
    rollForJail:   solo.rollForJail,
    endTurn:       solo.endTurn,
    build:         solo.build,
    sellBuilding:  solo.sellBuilding,
    mortgage:      solo.mortgage,
    unmortgage:    solo.unmortgage,
    placeBid:      solo.placeBid,
    passAuction:   solo.passAuction,
    auction:       solo.auction,
    reset:         solo.reset,
  }
}
