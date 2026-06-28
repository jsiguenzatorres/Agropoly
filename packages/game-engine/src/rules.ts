import type { BoardSpace, Player, BuildingResult, RentCalculation } from './types'
import { GROUP_SIZES, HOTEL_LEVEL } from './board'

export function calcRent(space: BoardSpace, board: BoardSpace[], players: Player[]): number {
  if (!space.ownerId || space.mortgaged) return 0

  if (space.type === 'utility') {
    const ownerUtilities = board.filter(s => s.type === 'utility' && s.ownerId === space.ownerId).length
    return 0  // caller must multiply by dice roll: × 4 (1 utility) or × 10 (both)
  }

  if (space.type === 'station') {
    const ownerStations = board.filter(s => s.type === 'station' && s.ownerId === space.ownerId).length
    return [0, 25, 50, 100, 200][ownerStations] ?? 0
  }

  const buildings = space.buildings ?? 0

  if (buildings === 0 && checkGroupOwnership(space.ownerId, space.group, board)) {
    return space.rents[0] * 2  // renta doble si dueño tiene grupo completo
  }

  return space.rents[Math.min(buildings, HOTEL_LEVEL)] ?? space.rents[0]
}

export function checkGroupOwnership(playerId: string, groupIdx: number, board: BoardSpace[]): boolean {
  const groupProps = board.filter(s => s.group === groupIdx && s.type === 'prop')
  return groupProps.every(s => s.ownerId === playerId)
}

export function canBuild(spaceId: number, playerId: string, board: BoardSpace[], players: Player[]): BuildingResult {
  const space = board[spaceId]

  if (!space || space.type !== 'prop') return { canBuild: false, reason: 'no_group' }
  if (!checkGroupOwnership(playerId, space.group, board)) return { canBuild: false, reason: 'no_group' }
  if (space.mortgaged) return { canBuild: false, reason: 'mortgaged' }
  if ((space.buildings ?? 0) >= HOTEL_LEVEL) return { canBuild: false, reason: 'max_buildings' }

  const player = players.find(p => p.id === playerId)
  if (!player || player.balance < space.hcost) return { canBuild: false, reason: 'insufficient_funds' }

  if (!canBuildBalanced(spaceId, board)) return { canBuild: false, reason: 'not_balanced' }

  return { canBuild: true }
}

export function canBuildBalanced(spaceId: number, board: BoardSpace[]): boolean {
  const space = board[spaceId]
  if (!space) return false

  const groupProps = board.filter(s => s.group === space.group && s.type === 'prop')
  const minBuildings = Math.min(...groupProps.map(s => s.buildings ?? 0))
  return (space.buildings ?? 0) <= minBuildings
}

// ─── Mortgage & sell ──────────────────────────────────────────────────────────

export const MORTGAGE_RATE   = 0.5    // bank pays 50% of price to mortgage
export const UNMORTGAGE_RATE = 1.1    // owner pays 55% to lift (50% × 1.10)

export function mortgageValue(space: BoardSpace): number {
  return Math.floor(space.price * MORTGAGE_RATE)
}

export function unmortgageCost(space: BoardSpace): number {
  return Math.ceil(space.price * MORTGAGE_RATE * UNMORTGAGE_RATE)
}

export function sellBuildingValue(space: BoardSpace): number {
  return Math.floor(space.hcost * MORTGAGE_RATE)  // sell improvements at 50% cost
}

export interface MortgageResult {
  canDo: boolean
  reason?: 'not_owned' | 'already_mortgaged' | 'has_buildings' | 'wrong_type'
}

export function canMortgage(spaceId: number, playerId: string, board: BoardSpace[]): MortgageResult {
  const space = board[spaceId]
  if (!space)                                     return { canDo: false, reason: 'wrong_type' }
  if (space.ownerId !== playerId)                 return { canDo: false, reason: 'not_owned' }
  if (space.mortgaged)                            return { canDo: false, reason: 'already_mortgaged' }
  if (space.type !== 'prop' && space.type !== 'station' && space.type !== 'utility')
    return { canDo: false, reason: 'wrong_type' }
  if ((space.buildings ?? 0) > 0)                 return { canDo: false, reason: 'has_buildings' }
  return { canDo: true }
}

export interface UnmortgageResult {
  canDo: boolean
  reason?: 'not_owned' | 'not_mortgaged' | 'insufficient_funds'
}

export function canUnmortgage(spaceId: number, playerId: string, board: BoardSpace[], players: Player[]): UnmortgageResult {
  const space = board[spaceId]
  if (!space || space.ownerId !== playerId) return { canDo: false, reason: 'not_owned' }
  if (!space.mortgaged)                      return { canDo: false, reason: 'not_mortgaged' }
  const player = players.find(p => p.id === playerId)
  if (!player || player.balance < unmortgageCost(space)) {
    return { canDo: false, reason: 'insufficient_funds' }
  }
  return { canDo: true }
}

export interface SellBuildingResult {
  canDo: boolean
  reason?: 'not_owned' | 'no_buildings' | 'not_balanced'
}

export function canSellBuilding(spaceId: number, playerId: string, board: BoardSpace[]): SellBuildingResult {
  const space = board[spaceId]
  if (!space || space.ownerId !== playerId) return { canDo: false, reason: 'not_owned' }
  if ((space.buildings ?? 0) <= 0)          return { canDo: false, reason: 'no_buildings' }
  // Balanced selling: can only sell from the property with the most buildings in the group
  const groupProps = board.filter(s => s.group === space.group && s.type === 'prop')
  const maxBuildings = Math.max(...groupProps.map(s => s.buildings ?? 0))
  if ((space.buildings ?? 0) < maxBuildings) return { canDo: false, reason: 'not_balanced' }
  return { canDo: true }
}

export function getNetWorth(player: Player, board: BoardSpace[]): number {
  const propValue = player.properties.reduce((sum, spaceId) => {
    const space = board[spaceId]
    if (!space) return sum
    if (space.mortgaged) return sum
    const buildingValue = ((space.buildings ?? 0) < HOTEL_LEVEL)
      ? (space.buildings ?? 0) * space.hcost
      : HOTEL_LEVEL * space.hcost
    return sum + space.price + buildingValue
  }, 0)
  return player.balance + propValue
}

export function checkBankruptcy(player: Player, amount: number, board: BoardSpace[]): {
  bankrupt: boolean
  canRaise: number
} {
  const netWorth = getNetWorth(player, board)
  return {
    bankrupt: netWorth < amount,
    canRaise: Math.max(0, netWorth - player.balance),
  }
}

export function findNearestUnowned(position: number, board: BoardSpace[]): number {
  for (let i = 1; i <= board.length; i++) {
    const idx = (position + i) % board.length
    if (board[idx].type === 'prop' && !board[idx].ownerId) return idx
  }
  return -1
}
