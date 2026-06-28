import { create } from 'zustand'
import type { Room } from 'colyseus.js'
import { BOARD_DATA } from '@agropoly/game-engine'
import type { GameState, Player, BoardSpace, Card } from '@agropoly/game-engine'
import type { PendingAction, AuctionState } from './gameStore'
import { useChatStore } from './chatStore'

export interface TradeOffer {
  fromId: string
  toId: string
  giveMoney: number
  givePropertyId: number  // -1 = none
  wantMoney: number
  wantPropertyId: number  // -1 = none
}

export interface TradeProposal {
  to: string
  giveMoney: number
  giveProp: number   // -1 = no property
  wantMoney: number
  wantProp: number
}

interface MultiplayerStore {
  room: Room | null
  mySessionId: string
  connected: boolean
  isSpectator: boolean

  // Mirror of GameStateSchema, projected into the same shapes gameStore uses
  game: GameState | null
  pending: PendingAction
  lastDice: { d1: number; d2: number; doubles: boolean } | null
  pendingCard: Card | null
  pendingAmount: number
  phase: 'waiting' | 'playing' | 'game_over'
  hostId: string
  isHost: boolean
  auction: AuctionState | null
  tradeOffer: TradeOffer | null

  setRoom: (room: Room | null, opts?: { spectator?: boolean }) => void
  disconnect: () => void

  // Actions = send messages to the room
  startGame:    () => void
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
  placeBid:        (amount: number) => void
  passAuction:     () => void
  proposeTrade:    (p: TradeProposal) => void
  acceptTrade:     () => void
  rejectTrade:     () => void
  useJailFreeCard: () => void
  sendChat:    (text: string) => void
  sendReact:   (emoji: string) => void
}

// ── Schema projection: turn an ArraySchema/MapSchema state into plain GameState shape

function projectGame(roomState: any): GameState {
  const players: Player[] = roomState.players.map((p: any) => ({
    id: p.id,
    name: p.name,
    tokenId: p.tokenId,
    balance: p.balance,
    position: p.position,
    jailed: p.jailed,
    jailTurns: p.jailTurns,
    jailFreeCards: p.jailFreeCards,
    bankrupt: p.bankrupt,
    isAI: p.isAI,
    difficulty: p.difficulty,
    properties: Array.from(p.properties as Iterable<number>),
  }))
  const board: BoardSpace[] = roomState.board.map((b: any) => {
    const orig = BOARD_DATA[b.id]
    return {
      id: b.id,
      type: b.type,
      group: b.group,
      name: b.name,
      price: b.price,
      hcost: b.hcost,
      rents: orig.rents,
      ownerId: b.ownerId || null,
      buildings: b.buildings,
      mortgaged: b.mortgaged,
    }
  })
  return {
    players,
    board,
    phase: roomState.phase === 'waiting' ? 'setup' : 'roll',
    currentPlayerIndex: roomState.currentPlayerIndex,
    turnCount: roomState.turnCount,
    doublesCount: roomState.doublesCount,
    cosechaDeck: [],
    riesgoDeck: [],
    logEntries: [],
    educationalMode: roomState.educationalMode,
    winner: roomState.winnerId || null,
    climate: roomState.climate as GameState['climate'],
  }
}

function projectCard(pendingCard: any, hasPendingCard: boolean): Card | null {
  if (!hasPendingCard || !pendingCard.id) return null
  try {
    return {
      id: pendingCard.id,
      type: pendingCard.type,
      icon: pendingCard.icon,
      title: pendingCard.title,
      text: pendingCard.text,
      effect: JSON.parse(pendingCard.effectJson),
    }
  } catch {
    return null
  }
}

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  room: null,
  mySessionId: '',
  connected: false,
  isSpectator: false,
  game: null,
  pending: 'roll',
  lastDice: null,
  pendingCard: null,
  pendingAmount: 0,
  phase: 'waiting',
  hostId: '',
  isHost: false,
  auction: null,
  tradeOffer: null,

  setRoom(room, opts) {
    if (!room) {
      set({ room: null, mySessionId: '', connected: false, isSpectator: false, game: null,
            pending: 'roll', lastDice: null, pendingCard: null, pendingAmount: 0,
            phase: 'waiting', hostId: '', isHost: false })
      return
    }
    set({ room, mySessionId: room.sessionId, connected: true, isSpectator: !!opts?.spectator })

    const apply = () => {
      const s: any = room.state
      const lastDice = (s.lastDice && (s.lastDice.d1 || s.lastDice.d2))
        ? { d1: s.lastDice.d1, d2: s.lastDice.d2, doubles: s.lastDice.doubles }
        : null
      const auction: AuctionState | null = s.hasAuction && s.auction
        ? {
            spaceId:         s.auction.spaceId,
            currentBid:      s.auction.currentBid,
            highBidderId:    s.auction.highBidderId || null,
            currentBidderId: s.auction.currentBidderId,
            participants:    Array.from(s.auction.participants as Iterable<string>),
          }
        : null
      const tradeOffer: TradeOffer | null = s.hasTradeOffer && s.tradeOffer
        ? {
            fromId:         s.tradeOffer.fromId,
            toId:           s.tradeOffer.toId,
            giveMoney:      s.tradeOffer.giveMoney,
            givePropertyId: s.tradeOffer.givePropertyId,
            wantMoney:      s.tradeOffer.wantMoney,
            wantPropertyId: s.tradeOffer.wantPropertyId,
          }
        : null
      set({
        game: projectGame(s),
        pending: s.pending,
        lastDice,
        pendingCard: projectCard(s.pendingCard, s.hasPendingCard),
        pendingAmount: s.pendingAmount,
        phase: s.phase,
        hostId: s.hostId,
        isHost: s.hostId === room.sessionId,
        auction,
        tradeOffer,
      })
    }

    room.onStateChange(apply)
    apply()

    // Ephemeral chat + reactions
    room.onMessage('chat_msg', (m: { fromId: string; fromName: string; text: string; ts: number }) => {
      useChatStore.getState().appendMessage(m)
    })
    room.onMessage('react', (r: { fromId: string; fromName: string; emoji: string; ts: number }) => {
      useChatStore.getState().appendReaction({ fromName: r.fromName, emoji: r.emoji })
    })

    room.onLeave(() => {
      useChatStore.getState().reset()
      get().setRoom(null)
    })
  },

  disconnect() {
    const { room } = get()
    if (room) room.leave().catch(() => {})
    set({ room: null, mySessionId: '', connected: false, game: null })
  },

  startGame()    { get().room?.send('start_game') },
  rollDice()     { get().room?.send('roll_dice') },
  confirmBuy()   { get().room?.send('confirm_buy') },
  skipBuy()      { get().room?.send('skip_buy') },
  confirmRent()  { get().room?.send('confirm_rent') },
  confirmTax()   { get().room?.send('confirm_tax') },
  drawCard()     { get().room?.send('draw_card') },
  applyCard()    { get().room?.send('apply_card') },
  payJailFine()  { get().room?.send('pay_jail_fine') },
  rollForJail()  { get().room?.send('roll_for_jail') },
  endTurn()           { get().room?.send('end_turn') },
  build(spaceId)      { get().room?.send('build', { spaceId }) },
  sellBuilding(spaceId) { get().room?.send('sell_building', { spaceId }) },
  mortgage(spaceId)   { get().room?.send('mortgage', { spaceId }) },
  unmortgage(spaceId) { get().room?.send('unmortgage', { spaceId }) },
  placeBid(amount)    { get().room?.send('place_bid', { amount }) },
  passAuction()       { get().room?.send('pass_auction') },
  proposeTrade(p)     { get().room?.send('propose_trade', p) },
  acceptTrade()       { get().room?.send('accept_trade') },
  rejectTrade()       { get().room?.send('reject_trade') },
  useJailFreeCard()   { get().room?.send('use_jail_card') },
  sendChat(text)      { get().room?.send('chat_msg', { text }) },
  sendReact(emoji)    { get().room?.send('react', { emoji }) },
}))

if (import.meta.env.DEV) {
  ;(window as unknown as { __mpStore: typeof useMultiplayerStore }).__mpStore = useMultiplayerStore
}
