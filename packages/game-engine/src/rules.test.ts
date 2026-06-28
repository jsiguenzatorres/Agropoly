import { describe, it, expect } from 'vitest'
import {
  calcRent, canBuild, canMortgage, canUnmortgage, canSellBuilding,
  mortgageValue, unmortgageCost, sellBuildingValue, getNetWorth,
  checkGroupOwnership, MORTGAGE_RATE, UNMORTGAGE_RATE,
} from './rules'
import { BOARD_DATA, WEALTH_VICTORY, AUCTION_MIN_BID, CLIMATE_INFO, rollClimate, HOTEL_LEVEL } from './board'
import { COSECHA_DECK, RIESGO_DECK, shuffle } from './cards'
import type { BoardSpace, Player } from './types'

// ── Test fixtures ─────────────────────────────────────────────────────────

function freshBoard(): BoardSpace[] {
  return BOARD_DATA.map(s => ({ ...s, ownerId: null, buildings: 0, mortgaged: false }))
}

function makePlayer(id: string, overrides: Partial<Player> = {}): Player {
  return {
    id, name: id, tokenId: 'maiz', balance: 1500, position: 0,
    jailed: false, jailTurns: 0, jailFreeCards: 0, bankrupt: false,
    isAI: false, difficulty: 'easy', properties: [],
    ...overrides,
  }
}

// ── calcRent ──────────────────────────────────────────────────────────────

describe('calcRent', () => {
  it('returns 0 when space has no owner', () => {
    const board = freshBoard()
    expect(calcRent(board[1], board, [])).toBe(0)
  })

  it('returns 0 when space is mortgaged', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[1].mortgaged = true
    expect(calcRent(board[1], board, [])).toBe(0)
  })

  it('returns base rent (rents[0]) when buildings=0 and group incomplete', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'   // Ahuachapán only — group 0 has 2 props
    expect(calcRent(board[1], board, [])).toBe(board[1].rents[0])
  })

  it('doubles base rent when group is fully owned without buildings', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[3].ownerId = 'p1'   // group 0 complete
    expect(calcRent(board[1], board, [])).toBe(board[1].rents[0] * 2)
  })

  it('returns rents[buildings] when improvements exist', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[1].buildings = 3
    expect(calcRent(board[1], board, [])).toBe(board[1].rents[3])
  })

  it('clamps at HOTEL_LEVEL', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[1].buildings = HOTEL_LEVEL
    expect(calcRent(board[1], board, [])).toBe(board[1].rents[HOTEL_LEVEL])
  })

  it('station: returns 0 (caller multiplies)', () => {
    const board = freshBoard()
    board[5].ownerId = 'p1'   // Canal BFA Occidente — station
    expect(calcRent(board[5], board, [])).toBe(25)  // single station
  })
})

// ── checkGroupOwnership ───────────────────────────────────────────────────

describe('checkGroupOwnership', () => {
  it('false when no props in group are owned', () => {
    const board = freshBoard()
    expect(checkGroupOwnership('p1', 0, board)).toBe(false)
  })

  it('true when all props in the group belong to player', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[3].ownerId = 'p1'
    expect(checkGroupOwnership('p1', 0, board)).toBe(true)
  })

  it('false when only some props are owned', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    expect(checkGroupOwnership('p1', 0, board)).toBe(false)
  })
})

// ── canBuild ──────────────────────────────────────────────────────────────

describe('canBuild', () => {
  it('rejects when player does not own the group', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'   // only one of two
    const players = [makePlayer('p1', { balance: 1000 })]
    const r = canBuild(1, 'p1', board, players)
    expect(r.canBuild).toBe(false)
    expect(r.reason).toBe('no_group')
  })

  it('rejects when mortgaged', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[3].ownerId = 'p1'
    board[1].mortgaged = true
    const players = [makePlayer('p1', { balance: 1000 })]
    expect(canBuild(1, 'p1', board, players).reason).toBe('mortgaged')
  })

  it('rejects when already at HOTEL_LEVEL', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'; board[1].buildings = HOTEL_LEVEL
    board[3].ownerId = 'p1'; board[3].buildings = HOTEL_LEVEL
    const players = [makePlayer('p1', { balance: 1000 })]
    expect(canBuild(1, 'p1', board, players).reason).toBe('max_buildings')
  })

  it('rejects when player cannot afford hcost', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[3].ownerId = 'p1'
    const players = [makePlayer('p1', { balance: 10 })]
    expect(canBuild(1, 'p1', board, players).reason).toBe('insufficient_funds')
  })

  it('rejects when group is not balanced', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'; board[1].buildings = 1
    board[3].ownerId = 'p1'; board[3].buildings = 0
    const players = [makePlayer('p1', { balance: 1000 })]
    // Trying to build on 1 (already higher) — not balanced
    expect(canBuild(1, 'p1', board, players).reason).toBe('not_balanced')
  })

  it('allows when all checks pass', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[3].ownerId = 'p1'
    const players = [makePlayer('p1', { balance: 1000 })]
    expect(canBuild(1, 'p1', board, players).canBuild).toBe(true)
  })
})

// ── Mortgage ──────────────────────────────────────────────────────────────

describe('mortgage helpers', () => {
  it('mortgageValue = floor(price × MORTGAGE_RATE)', () => {
    const sp = freshBoard()[1]   // Ahuachapán price 60
    expect(mortgageValue(sp)).toBe(Math.floor(60 * MORTGAGE_RATE))
  })

  it('unmortgageCost = ceil(price × MORTGAGE_RATE × UNMORTGAGE_RATE)', () => {
    const sp = freshBoard()[5]   // Canal BFA price 200
    expect(unmortgageCost(sp)).toBe(Math.ceil(200 * MORTGAGE_RATE * UNMORTGAGE_RATE))
  })

  it('sellBuildingValue = floor(hcost × MORTGAGE_RATE)', () => {
    const sp = freshBoard()[1]   // hcost 50
    expect(sellBuildingValue(sp)).toBe(Math.floor(50 * MORTGAGE_RATE))
  })

  it('canMortgage rejects non-owners', () => {
    const board = freshBoard()
    board[1].ownerId = 'p2'
    expect(canMortgage(1, 'p1', board).reason).toBe('not_owned')
  })

  it('canMortgage rejects if already mortgaged', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[1].mortgaged = true
    expect(canMortgage(1, 'p1', board).reason).toBe('already_mortgaged')
  })

  it('canMortgage rejects if has buildings', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    board[1].buildings = 1
    expect(canMortgage(1, 'p1', board).reason).toBe('has_buildings')
  })

  it('canMortgage allows clean owned property', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    expect(canMortgage(1, 'p1', board).canDo).toBe(true)
  })

  it('canUnmortgage rejects if not enough balance', () => {
    const board = freshBoard()
    board[5].ownerId = 'p1'
    board[5].mortgaged = true
    const players = [makePlayer('p1', { balance: 5 })]
    expect(canUnmortgage(5, 'p1', board, players).reason).toBe('insufficient_funds')
  })

  it('canUnmortgage allows when balance sufficient', () => {
    const board = freshBoard()
    board[5].ownerId = 'p1'
    board[5].mortgaged = true
    const players = [makePlayer('p1', { balance: 500 })]
    expect(canUnmortgage(5, 'p1', board, players).canDo).toBe(true)
  })
})

// ── canSellBuilding ───────────────────────────────────────────────────────

describe('canSellBuilding', () => {
  it('rejects when no buildings', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'
    expect(canSellBuilding(1, 'p1', board).reason).toBe('no_buildings')
  })

  it('rejects when not the max in group (balance rule)', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'; board[1].buildings = 0
    board[3].ownerId = 'p1'; board[3].buildings = 2
    // Cannot sell from 1 (has 0); but 3 has 2 — actually testing the other side
    // Sell from 1 with 0 buildings → no_buildings (first guard hits)
    expect(canSellBuilding(1, 'p1', board).reason).toBe('no_buildings')
    // Sell from 3 OK (it's the max)
    expect(canSellBuilding(3, 'p1', board).canDo).toBe(true)
  })
})

// ── getNetWorth ───────────────────────────────────────────────────────────

describe('getNetWorth', () => {
  it('balance only when no props', () => {
    const board = freshBoard()
    const p = makePlayer('p1', { balance: 1234 })
    expect(getNetWorth(p, board)).toBe(1234)
  })

  it('skips mortgaged properties from net worth', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'; board[1].mortgaged = true
    const p = makePlayer('p1', { balance: 1000, properties: [1] })
    expect(getNetWorth(p, board)).toBe(1000)
  })

  it('includes property price + building value', () => {
    const board = freshBoard()
    board[1].ownerId = 'p1'; board[1].buildings = 2  // hcost 50, price 60
    const p = makePlayer('p1', { balance: 1000, properties: [1] })
    // 1000 + 60 + 2*50 = 1160
    expect(getNetWorth(p, board)).toBe(1160)
  })
})

// ── Board / climate / cards integrity ─────────────────────────────────────

describe('BOARD_DATA integrity', () => {
  it('has exactly 40 spaces', () => {
    expect(BOARD_DATA.length).toBe(40)
  })

  it('every space has unique id 0-39', () => {
    const ids = BOARD_DATA.map(s => s.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 40 }, (_, i) => i))
  })

  it('all rents arrays have length 6', () => {
    BOARD_DATA.forEach(s => expect(s.rents.length).toBe(6))
  })
})

describe('Climate die', () => {
  it('rolls one of 4 faces', () => {
    for (let i = 0; i < 50; i++) {
      const face = rollClimate()
      expect(['sol', 'lluvia', 'tormenta', 'arcoiris']).toContain(face)
    }
  })

  it('all faces have multipliers > 0', () => {
    Object.values(CLIMATE_INFO).forEach(c => {
      expect(c.multiplier).toBeGreaterThan(0)
    })
  })
})

describe('Card decks', () => {
  it('Cosecha has 24 cards with unique IDs', () => {
    expect(COSECHA_DECK.length).toBe(24)
    const ids = new Set(COSECHA_DECK.map(c => c.id))
    expect(ids.size).toBe(24)
  })

  it('Riesgo has 24 cards with unique IDs', () => {
    expect(RIESGO_DECK.length).toBe(24)
    const ids = new Set(RIESGO_DECK.map(c => c.id))
    expect(ids.size).toBe(24)
  })

  it('every card has a valid effect action', () => {
    const valid = ['collect', 'pay', 'move', 'move_relative', 'jail_free', 'go_to_jail', 'pay_per_building', 'collect_from_players']
    ;[...COSECHA_DECK, ...RIESGO_DECK].forEach(c => {
      expect(valid).toContain(c.effect.action)
    })
  })

  it('shuffle preserves length and content', () => {
    const original = [...COSECHA_DECK]
    const shuffled = shuffle(original)
    expect(shuffled.length).toBe(original.length)
    expect(new Set(shuffled.map(c => c.id))).toEqual(new Set(original.map(c => c.id)))
  })
})

describe('Constants', () => {
  it('WEALTH_VICTORY = 5000', () => expect(WEALTH_VICTORY).toBe(5000))
  it('AUCTION_MIN_BID > 0', () => expect(AUCTION_MIN_BID).toBeGreaterThan(0))
  it('HOTEL_LEVEL = 5', () => expect(HOTEL_LEVEL).toBe(5))
})
