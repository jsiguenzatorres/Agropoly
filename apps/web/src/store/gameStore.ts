import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  BOARD_DATA, STARTING_BALANCE, GO_AMOUNT,
  JAIL_POSITION, JAIL_FINE, MAX_JAIL_TURNS,
  calcRent, checkGroupOwnership, getNetWorth,
  shuffle, COSECHA_DECK, RIESGO_DECK,
} from '@agropoly/game-engine'
import type { GameState, Player, BoardSpace, Card, TokenId, Difficulty } from '@agropoly/game-engine'
import type { MascotLine } from '../lib/mascot-dialogues'

export type PendingAction =
  | 'roll' | 'buy' | 'pay_rent' | 'pay_tax'
  | 'cosecha' | 'riesgo' | 'apply_card'
  | 'jail_choice' | 'end' | 'game_over'

export interface PlayerSetup {
  name: string
  tokenId: TokenId
  isAI: boolean
  difficulty: Difficulty
}

interface GameStore {
  game: GameState | null
  gameId: number          // increments on initGame so tokens reset visual pos
  isMoving: boolean       // true while token animation plays
  pending: PendingAction
  lastDice: { d1: number; d2: number; doubles: boolean } | null
  pendingCard: Card | null
  pendingAmount: number

  mascot: MascotLine | null
  mascotSeq: number       // monotonically increasing; triggers MascotOverlay effect even for same text
  showMascot: (line: MascotLine) => void
  dismissMascot: () => void

  setMoving: (v: boolean) => void
  initGame: (setups: PlayerSetup[], eduMode: boolean) => void
  rollDice: () => void
  confirmBuy: () => void
  skipBuy: () => void
  confirmRent: () => void
  confirmTax: () => void
  drawCard: () => void
  applyCard: () => void
  payJailFine: () => void
  rollForJail: () => void
  endTurn: () => void
  reset: () => void
}

function freshBoard(): BoardSpace[] {
  return BOARD_DATA.map(s => ({ ...s, ownerId: null, buildings: 0, mortgaged: false }))
}

function freshPlayer(setup: PlayerSetup, id: string): Player {
  return {
    id,
    name: setup.name,
    tokenId: setup.tokenId,
    balance: STARTING_BALANCE,
    position: 0,
    jailed: false,
    jailTurns: 0,
    jailFreeCards: 0,
    bankrupt: false,
    isAI: setup.isAI,
    difficulty: setup.difficulty,
    properties: [],
  }
}

function rollD6() { return Math.floor(Math.random() * 6) + 1 }

function activePlayers(players: Player[]) {
  return players.filter(p => !p.bankrupt)
}

function nextPlayerIndex(game: GameState): number {
  const active = activePlayers(game.players)
  if (active.length <= 1) return game.currentPlayerIndex
  let idx = (game.currentPlayerIndex + 1) % game.players.length
  while (game.players[idx].bankrupt) {
    idx = (idx + 1) % game.players.length
  }
  return idx
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    game: null,
    gameId: 0,
    isMoving: false,
    mascot: null,
    mascotSeq: 0,
    pending: 'roll',
    lastDice: null,
    pendingCard: null,
    pendingAmount: 0,

    showMascot(line) { set(s => { s.mascot = line; s.mascotSeq++ }) },
    dismissMascot()  { set(s => { s.mascot = null }) },

    setMoving(v) { set(s => { s.isMoving = v }) },

    initGame(setups, eduMode) {
      const players = setups.map((s, i) => freshPlayer(s, `p${i}`))
      const game: GameState = {
        players,
        board: freshBoard(),
        phase: 'roll',
        currentPlayerIndex: 0,
        turnCount: 0,
        doublesCount: 0,
        cosechaDeck: shuffle([...COSECHA_DECK]),
        riesgoDeck: shuffle([...RIESGO_DECK]),
        logEntries: [],
        educationalMode: eduMode,
        winner: null,
      }
      set(s => {
        s.game = game
        s.gameId++
        s.isMoving = false
        s.pending = 'roll'
        s.lastDice = null
        s.pendingCard = null
        s.pendingAmount = 0
      })
    },

    rollDice() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (!player || player.bankrupt) return

        // Jail handling
        if (player.jailed) {
          s.pending = 'jail_choice'
          return
        }

        const d1 = rollD6(), d2 = rollD6()
        const doubles = d1 === d2
        const total = d1 + d2
        s.lastDice = { d1, d2, doubles }

        if (doubles) {
          s.game.doublesCount++
          if (s.game.doublesCount >= 3) {
            // 3 doubles → jail
            player.position = JAIL_POSITION
            player.jailed = true
            player.jailTurns = 0
            s.game.doublesCount = 0
            s.pending = 'end'
            return
          }
        } else {
          s.game.doublesCount = 0
        }

        // Move
        const prevPos = player.position
        player.position = (player.position + total) % 40

        // Passed GO
        if (player.position < prevPos && player.position !== 0) {
          player.balance += GO_AMOUNT
        }

        // Resolve landing
        const space = s.game.board[player.position]
        if (!space) { s.pending = 'end'; return }

        switch (space.type) {
          case 'go':
            player.balance += GO_AMOUNT
            s.pending = 'end'
            break
          case 'jail':
            s.pending = 'end'  // just visiting
            break
          case 'gotojail':
            player.position = JAIL_POSITION
            player.jailed = true
            player.jailTurns = 0
            s.game.doublesCount = 0
            s.pending = 'end'
            break
          case 'free':
            s.pending = 'end'
            break
          case 'tax':
            s.pendingAmount = space.price
            s.pending = 'pay_tax'
            break
          case 'cosecha':
            s.pending = 'cosecha'
            break
          case 'riesgo':
            s.pending = 'riesgo'
            break
          case 'prop':
          case 'station':
          case 'utility':
            if (!space.ownerId) {
              s.pending = 'buy'
            } else if (space.ownerId === player.id) {
              s.pending = 'end'
            } else {
              const owner = s.game.players.find(p => p.id === space.ownerId)
              if (!owner || owner.bankrupt || space.mortgaged) {
                s.pending = 'end'
                break
              }
              let rent = 0
              if (space.type === 'utility') {
                const ownerUtils = s.game.board.filter(x => x.type === 'utility' && x.ownerId === space.ownerId).length
                rent = total * (ownerUtils === 2 ? 10 : 4)
              } else {
                rent = calcRent(space, s.game.board, s.game.players)
              }
              s.pendingAmount = rent
              s.pending = 'pay_rent'
            }
            break
          default:
            s.pending = 'end'
        }
      })
    },

    confirmBuy() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        const space = s.game.board[player.position]
        if (!space || player.balance < space.price) return
        player.balance -= space.price
        space.ownerId = player.id
        player.properties.push(space.id)
        s.pending = 'end'
      })
    },

    skipBuy() {
      set(s => { s.pending = 'end' })
    },

    confirmRent() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        const space = s.game.board[player.position]
        const amount = s.pendingAmount
        player.balance -= amount
        if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
        const owner = s.game.players.find(p => p.id === space?.ownerId)
        if (owner) owner.balance += amount
        s.pendingAmount = 0
        s.pending = 'end'
      })
    },

    confirmTax() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        player.balance -= s.pendingAmount
        if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
        s.pendingAmount = 0
        s.pending = 'end'
      })
    },

    drawCard() {
      set(s => {
        if (!s.game) return
        const isCosecha = s.pending === 'cosecha'
        const deck = isCosecha ? s.game.cosechaDeck : s.game.riesgoDeck
        if (!deck.length) return
        const [card, ...rest] = deck
        if (isCosecha) s.game.cosechaDeck = rest
        else s.game.riesgoDeck = rest
        s.pendingCard = card
        s.pending = 'apply_card'
      })
    },

    applyCard() {
      set(s => {
        if (!s.game || !s.pendingCard) return
        const player = s.game.players[s.game.currentPlayerIndex]
        const effect = s.pendingCard.effect

        switch (effect.action) {
          case 'collect':
            player.balance += effect.amount
            break
          case 'pay':
            player.balance -= effect.amount
            if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
            break
          case 'move':
            player.position = effect.to
            break
          case 'move_relative':
            player.position = Math.max(0, (player.position + effect.steps + 40) % 40)
            break
          case 'go_to_jail':
            player.position = JAIL_POSITION
            player.jailed = true
            player.jailTurns = 0
            break
          case 'jail_free':
            player.jailFreeCards++
            break
          case 'collect_from_players':
            s.game.players.forEach(p => {
              if (p.id !== player.id && !p.bankrupt) {
                const pay = Math.min(p.balance, effect.amount)
                p.balance -= pay
                player.balance += pay
              }
            })
            break
          case 'pay_per_building':
            s.game.board.forEach(sp => {
              if (sp.ownerId === player.id && (sp.buildings ?? 0) > 0) {
                const buildings = sp.buildings ?? 0
                const cost = buildings < 5
                  ? buildings * effect.house
                  : effect.hotel
                player.balance -= cost
              }
            })
            if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
            break
        }
        s.pendingCard = null
        s.pending = 'end'
      })
    },

    payJailFine() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        player.balance -= JAIL_FINE
        player.jailed = false
        player.jailTurns = 0
        s.pending = 'roll'
      })
    },

    rollForJail() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        const d1 = rollD6(), d2 = rollD6()
        s.lastDice = { d1, d2, doubles: d1 === d2 }
        if (d1 === d2) {
          player.jailed = false
          player.jailTurns = 0
          player.position = (JAIL_POSITION + d1 + d2) % 40
          s.pending = 'end'
        } else {
          player.jailTurns++
          if (player.jailTurns >= MAX_JAIL_TURNS) {
            player.balance -= JAIL_FINE
            if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
            player.jailed = false
            player.jailTurns = 0
          }
          s.pending = 'end'
        }
      })
    },

    endTurn() {
      set(s => {
        if (!s.game) return
        const alive = activePlayers(s.game.players)
        if (alive.length <= 1) {
          s.game.winner = alive[0]?.id ?? null
          s.pending = 'game_over'
          return
        }
        const doubles = s.lastDice?.doubles ?? false
        const currentBankrupt = s.game.players[s.game.currentPlayerIndex].bankrupt
        if (doubles && !currentBankrupt) {
          // Roll again — same player
          s.pending = 'roll'
        } else {
          s.game.currentPlayerIndex = nextPlayerIndex(s.game)
          s.game.turnCount++
          s.pending = 'roll'
        }
        s.lastDice = null
      })
    },

    reset() {
      set({ game: null, pending: 'roll', lastDice: null, pendingCard: null, pendingAmount: 0 })
    },
  }))
)
