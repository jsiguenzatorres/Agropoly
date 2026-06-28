import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  BOARD_DATA, STARTING_BALANCE, GO_AMOUNT, WEALTH_VICTORY, AUCTION_MIN_BID,
  JAIL_POSITION, JAIL_FINE, MAX_JAIL_TURNS,
  calcRent, canBuild, canMortgage, canUnmortgage, canSellBuilding,
  mortgageValue, unmortgageCost, sellBuildingValue, getNetWorth,
  shuffle, COSECHA_DECK, RIESGO_DECK,
  rollClimate, CLIMATE_INFO,
} from '@agropoly/game-engine'
import type { GameState, Player, BoardSpace, Card, TokenId, Difficulty } from '@agropoly/game-engine'
import type { MascotLine } from '../lib/mascot-dialogues'
import type { EduTip } from '../lib/edu-tips'
import { quizForCardType, type QuizQuestion } from '../lib/glosario'

export type PendingAction =
  | 'roll' | 'buy' | 'pay_rent' | 'pay_tax'
  | 'cosecha' | 'riesgo' | 'apply_card'
  | 'jail_choice' | 'auction' | 'end' | 'game_over'

export interface AuctionState {
  spaceId: number
  currentBid: number          // 0 = no bids yet
  highBidderId: string | null
  participants: string[]      // player IDs still in (haven't passed)
  currentBidderId: string     // whose turn it is to bid/pass
}

export interface PlayerSetup {
  name: string
  tokenId: TokenId
  isAI: boolean
  difficulty: Difficulty
}

interface GameStore {
  game: GameState | null
  gameId: number          // increments on initGame so tokens reset visual pos
  sessionId: string       // unique per partida — used as DB primary key
  startedAt: number       // ms epoch when initGame was called
  isMoving: boolean       // true while token animation plays
  pending: PendingAction
  lastDice: { d1: number; d2: number; doubles: boolean } | null
  pendingCard: Card | null
  pendingAmount: number

  auction: AuctionState | null

  mascot: MascotLine | null
  mascotSeq: number       // monotonically increasing; triggers MascotOverlay effect even for same text
  showMascot: (line: MascotLine) => void
  dismissMascot: () => void

  eduTip: EduTip | null
  eduTipSeq: number
  showEduTip: (tip: EduTip) => void
  dismissEduTip: () => void

  // Educational quizzes (only when game.educationalMode === true)
  pendingQuiz: QuizQuestion | null
  conceptosVistos: string[]   // unique concept IDs the player has been quizzed on
  showQuiz: (quiz: QuizQuestion) => void
  dismissQuiz: () => void

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
  build: (spaceId: number) => void
  sellBuilding: (spaceId: number) => void
  mortgage: (spaceId: number) => void
  unmortgage: (spaceId: number) => void
  placeBid: (amount: number) => void
  passAuction: () => void
  useJailFreeCard: () => void
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

// Transfer all of `debtor`'s assets when going bankrupt.
// If creditor is provided: properties (post-improvement-sale) move to creditor; the
// creditor also receives the proceeds of selling improvements back to the bank at 50% hcost.
// If no creditor (tax / card): properties return to bank (ownerId=null), improvements lost.
function liquidatePlayer(debtor: Player, board: BoardSpace[], creditor: Player | null) {
  for (const propId of debtor.properties) {
    const sp = board[propId]
    if (!sp) continue
    const lvl = sp.buildings ?? 0
    if (lvl > 0 && creditor) {
      // Sell improvements back to the bank, credit the creditor
      const refund = (lvl >= 5 ? 5 : lvl) * Math.floor(sp.hcost * 0.5)
      creditor.balance += refund
    }
    sp.buildings = 0
    sp.mortgaged = false
    if (creditor) {
      sp.ownerId = creditor.id
      creditor.properties.push(propId)
    } else {
      sp.ownerId = null
    }
  }
  debtor.properties = []
  debtor.balance = 0
  debtor.bankrupt = true
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
  immer((set) => ({
    game: null,
    gameId: 0,
    sessionId: '',
    startedAt: 0,
    isMoving: false,
    auction: null,
    mascot: null,
    mascotSeq: 0,
    eduTip: null,
    eduTipSeq: 0,
    pendingQuiz: null,
    conceptosVistos: [],
    pending: 'roll',
    lastDice: null,
    pendingCard: null,
    pendingAmount: 0,

    showMascot(line) { set(s => { s.mascot = line; s.mascotSeq++ }) },
    dismissMascot()  { set(s => { s.mascot = null }) },

    showEduTip(tip)  { set(s => { s.eduTip = tip; s.eduTipSeq++ }) },
    dismissEduTip()  { set(s => { s.eduTip = null }) },

    showQuiz(quiz)   { set(s => {
      s.pendingQuiz = quiz
      if (!s.conceptosVistos.includes(quiz.conceptoId)) s.conceptosVistos.push(quiz.conceptoId)
    }) },
    dismissQuiz()    { set(s => { s.pendingQuiz = null }) },

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
        s.sessionId = `solo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
        s.startedAt = Date.now()
        s.isMoving = false
        s.pending = 'roll'
        s.lastDice = null
        s.pendingCard = null
        s.pendingAmount = 0
        s.pendingQuiz = null
        s.conceptosVistos = []
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
        s.game.climate = rollClimate()

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
      set(s => {
        if (!s.game) { s.pending = 'end'; return }
        const player = s.game.players[s.game.currentPlayerIndex]
        const space = s.game.board[player.position]
        if (!space || space.ownerId) { s.pending = 'end'; return }
        // Start auction with all OTHER non-bankrupt players
        const eligible = s.game.players
          .filter(p => p.id !== player.id && !p.bankrupt)
          .map(p => p.id)
        if (eligible.length === 0) { s.pending = 'end'; return }
        s.auction = {
          spaceId: space.id,
          currentBid: 0,
          highBidderId: null,
          participants: eligible,
          currentBidderId: eligible[0],
        }
        s.pending = 'auction'
      })
    },

    placeBid(amount) {
      set(s => {
        if (!s.game || !s.auction) return
        const space = s.game.board[s.auction.spaceId]
        if (!space) return
        const bidder = s.game.players.find(p => p.id === s.auction!.currentBidderId)
        if (!bidder || bidder.bankrupt) return
        const minBid = Math.max(s.auction.currentBid + AUCTION_MIN_BID, AUCTION_MIN_BID)
        if (amount < minBid || amount > bidder.balance) return
        s.auction.currentBid = amount
        s.auction.highBidderId = bidder.id
        // Advance to next participant
        const idx = s.auction.participants.indexOf(bidder.id)
        const nextIdx = (idx + 1) % s.auction.participants.length
        s.auction.currentBidderId = s.auction.participants[nextIdx]
      })
    },

    passAuction() {
      set(s => {
        if (!s.game || !s.auction) return
        const currentId = s.auction.currentBidderId
        s.auction.participants = s.auction.participants.filter(id => id !== currentId)
        // If nobody left to bid, finalize
        if (s.auction.participants.length === 0
            || (s.auction.participants.length === 1 && s.auction.participants[0] === s.auction.highBidderId)) {
          if (s.auction.highBidderId && s.auction.currentBid > 0) {
            const winner = s.game.players.find(p => p.id === s.auction!.highBidderId)
            const space = s.game.board[s.auction.spaceId]
            if (winner && space) {
              winner.balance -= s.auction.currentBid
              space.ownerId = winner.id
              winner.properties.push(space.id)
            }
          }
          s.auction = null
          s.pending = 'end'
          return
        }
        // Advance bidder
        const idx = s.auction.participants.indexOf(currentId)
        const nextIdx = idx >= 0 ? idx % s.auction.participants.length : 0
        s.auction.currentBidderId = s.auction.participants[Math.max(0, nextIdx)]
      })
    },

    confirmRent() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        const space = s.game.board[player.position]
        const amount = s.pendingAmount
        const owner = s.game.players.find(p => p.id === space?.ownerId)
        if (player.balance >= amount) {
          player.balance -= amount
          if (owner) owner.balance += amount
        } else {
          // Pay what we can, then liquidate to the creditor
          if (owner) owner.balance += player.balance
          liquidatePlayer(player, s.game.board, owner ?? null)
        }
        s.pendingAmount = 0
        s.pending = 'end'
      })
    },

    confirmTax() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (player.balance >= s.pendingAmount) {
          player.balance -= s.pendingAmount
        } else {
          liquidatePlayer(player, s.game.board, null)
        }
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
        // Educational quiz: only for human players in edu mode, 50% chance
        const player = s.game.players[s.game.currentPlayerIndex]
        if (s.game.educationalMode && player && !player.isAI && Math.random() < 0.5) {
          const quiz = quizForCardType(isCosecha ? 'cosecha' : 'riesgo')
          s.pendingQuiz = quiz
          if (!s.conceptosVistos.includes(quiz.conceptoId)) s.conceptosVistos.push(quiz.conceptoId)
        }
      })
    },

    applyCard() {
      set(s => {
        if (!s.game || !s.pendingCard) return
        const player = s.game.players[s.game.currentPlayerIndex]
        const effect = s.pendingCard.effect

        switch (effect.action) {
          case 'collect': {
            // Climate die modifies Cosecha collects only
            const isCosechaCard = s.pendingCard?.type === 'cosecha'
            const mult = isCosechaCard && s.game.climate
              ? CLIMATE_INFO[s.game.climate].multiplier
              : 1
            player.balance += Math.round(effect.amount * mult)
            break
          }
          case 'pay':
            if (player.balance >= effect.amount) player.balance -= effect.amount
            else liquidatePlayer(player, s.game.board, null)
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
                if (p.balance >= effect.amount) {
                  p.balance -= effect.amount
                  player.balance += effect.amount
                } else {
                  player.balance += p.balance
                  liquidatePlayer(p, s.game!.board, player)
                }
              }
            })
            break
          case 'pay_per_building': {
            let total = 0
            s.game.board.forEach(sp => {
              if (sp.ownerId === player.id && (sp.buildings ?? 0) > 0) {
                const buildings = sp.buildings ?? 0
                total += buildings < 5 ? buildings * effect.house : effect.hotel
              }
            })
            if (player.balance >= total) player.balance -= total
            else liquidatePlayer(player, s.game.board, null)
            break
          }
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

    useJailFreeCard() {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (!player || !player.jailed || player.jailFreeCards <= 0) return
        player.jailFreeCards--
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

    build(spaceId) {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (!player || player.bankrupt) return
        const result = canBuild(spaceId, player.id, s.game.board, s.game.players)
        if (!result.canBuild) return
        const space = s.game.board[spaceId]
        if (!space) return
        player.balance -= space.hcost
        space.buildings = (space.buildings ?? 0) + 1
      })
    },

    sellBuilding(spaceId) {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (!player || player.bankrupt) return
        const r = canSellBuilding(spaceId, player.id, s.game.board)
        if (!r.canDo) return
        const space = s.game.board[spaceId]
        if (!space) return
        space.buildings = (space.buildings ?? 0) - 1
        player.balance += sellBuildingValue(space)
      })
    },

    mortgage(spaceId) {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (!player || player.bankrupt) return
        const r = canMortgage(spaceId, player.id, s.game.board)
        if (!r.canDo) return
        const space = s.game.board[spaceId]
        if (!space) return
        space.mortgaged = true
        player.balance += mortgageValue(space)
      })
    },

    unmortgage(spaceId) {
      set(s => {
        if (!s.game) return
        const player = s.game.players[s.game.currentPlayerIndex]
        if (!player || player.bankrupt) return
        const r = canUnmortgage(spaceId, player.id, s.game.board, s.game.players)
        if (!r.canDo) return
        const space = s.game.board[spaceId]
        if (!space) return
        player.balance -= unmortgageCost(space)
        space.mortgaged = false
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
        // Wealth victory: any active player with net worth ≥ WEALTH_VICTORY wins immediately
        const wealthWinner = alive.find(p => getNetWorth(p, s.game!.board) >= WEALTH_VICTORY)
        if (wealthWinner) {
          s.game.winner = wealthWinner.id
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

if (import.meta.env.DEV) {
  ;(window as unknown as { __gameStore: typeof useGameStore }).__gameStore = useGameStore
}
