// Per-difficulty AI strategy. All functions are pure — they read state and return decisions.
import { canBuild, checkGroupOwnership, AUCTION_MIN_BID, HOTEL_LEVEL } from '@agropoly/game-engine'
import type { Player, BoardSpace, Difficulty } from '@agropoly/game-engine'

const RESERVE: Record<Difficulty, number> = {
  easy:   100,   // barely any cushion
  hard:   300,   // 1.2× average rent
  expert: 450,
}

// ─── Buy decision ────────────────────────────────────────────────────────────

export function aiShouldBuy(player: Player, space: BoardSpace, board: BoardSpace[]): boolean {
  const reserve = RESERVE[player.difficulty] ?? 100
  if (player.balance < space.price) return false
  if (player.difficulty === 'easy') return true

  // Hard/expert: also need reserve buffer after the purchase
  if (player.balance - space.price < reserve) {
    // Allow if this purchase completes one of our groups (huge upside)
    if (space.type === 'prop' && countsTowardsGroupCompletion(player.id, space, board)) return true
    return false
  }
  return true
}

function countsTowardsGroupCompletion(playerId: string, space: BoardSpace, board: BoardSpace[]): boolean {
  if (space.type !== 'prop') return false
  const groupProps = board.filter(s => s.group === space.group && s.type === 'prop')
  const mineInGroup = groupProps.filter(s => s.ownerId === playerId).length
  // We're about to own one more, so if all are accounted for...
  return mineInGroup + 1 === groupProps.length
}

// ─── Build decision: list of property IDs to attempt to build, in priority order ──

export function aiBuildPicks(player: Player, board: BoardSpace[], players: Player[]): number[] {
  const reserve = RESERVE[player.difficulty] ?? 100
  const buildable = player.properties
    .map(id => board[id])
    .filter((sp): sp is BoardSpace => !!sp && canBuild(sp.id, player.id, board, players).canBuild)

  if (buildable.length === 0) return []

  if (player.difficulty === 'easy') {
    // Cheapest first
    return buildable.sort((a, b) => a.hcost - b.hcost).map(s => s.id)
  }

  // Hard/expert: prioritize properties where the group is fully owned and has fewer buildings
  // (balance the group up), and respect the reserve
  return buildable
    .filter(sp => player.balance - sp.hcost >= reserve)
    .sort((a, b) => {
      // First: lower current building level (catch up)
      const lvlDiff = (a.buildings ?? 0) - (b.buildings ?? 0)
      if (lvlDiff !== 0) return lvlDiff
      // Then: higher base rent group (better ROI)
      return b.rents[1] - a.rents[1]
    })
    .map(s => s.id)
}

// ─── Auction bidding decision ────────────────────────────────────────────────

export function aiAuctionBid(
  player: Player,
  space: BoardSpace,
  currentBid: number,
  board: BoardSpace[],
): number | null {  // returns the bid amount, or null = pass
  const nextBid = currentBid + AUCTION_MIN_BID
  if (nextBid > player.balance) return null

  const reserve = RESERVE[player.difficulty] ?? 100
  const completesGroup = countsTowardsGroupCompletion(player.id, space, board)

  // Caps depend on difficulty and strategic value
  let cap: number
  if (player.difficulty === 'easy') {
    cap = Math.floor(space.price * 0.7)
  } else if (player.difficulty === 'hard') {
    cap = completesGroup ? Math.floor(space.price * 1.1) : Math.floor(space.price * 0.85)
  } else {
    // expert
    cap = completesGroup ? Math.floor(space.price * 1.4) : Math.floor(space.price * 0.95)
  }

  if (nextBid > cap) return null
  if (player.balance - nextBid < reserve && !completesGroup) return null

  return nextBid
}

// ─── Mortgage decision: which property to mortgage if we need liquidity ───────
// Returns property id to mortgage, or null if not applicable.
export function aiMortgagePick(
  player: Player,
  needed: number,
  board: BoardSpace[],
): number | null {
  if (player.difficulty === 'easy') return null  // easy never hipoteca

  const candidates = player.properties
    .map(id => board[id])
    .filter((sp): sp is BoardSpace =>
      !!sp && !sp.mortgaged && (sp.buildings ?? 0) === 0
      // Don't mortgage props inside fully-owned groups (would hurt our rent income)
      && !checkGroupOwnership(player.id, sp.group, board)
    )

  if (candidates.length === 0) return null

  // Mortgage the lowest-priced first (lose the least leverage)
  candidates.sort((a, b) => a.price - b.price)

  let cumulative = 0
  for (const c of candidates) {
    cumulative += Math.floor(c.price * 0.5)
    if (cumulative >= needed) return c.id
  }
  // Not enough — still mortgage the cheapest to chip away
  return candidates[0].id
}

// ─── Sanity helper: re-export HOTEL_LEVEL for callers ─────────────────────────
export { HOTEL_LEVEL }
