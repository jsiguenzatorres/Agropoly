export type GamePhase = 'setup' | 'roll' | 'action' | 'end'
export type Difficulty = 'easy' | 'hard' | 'expert'
export type TokenId = 'maiz' | 'cafe' | 'vaca' | 'tractor' | 'milpa' | 'pez'
export type MascotId = 'don_fomento' | 'maicita' | 'don_cafe' | 'la_canche' | 'la_vaquita' | 'la_tormenta'
export type Emotion = 'neutral' | 'happy' | 'sad' | 'excited' | 'dramatic' | 'concerned'

export type SpaceType =
  | 'prop'     // Propiedad comprable
  | 'station'  // Canal BFA (estación)
  | 'utility'  // Servicio BFA
  | 'cosecha'  // Tarjeta Cosecha (Community Chest)
  | 'riesgo'   // Tarjeta Riesgo (Chance)
  | 'tax'      // Impuesto
  | 'go'       // Casilla INICIO
  | 'jail'     // Emergencia Climática
  | 'free'     // Feria del Campo
  | 'gotojail' // Ir a Emergencia

export interface BoardSpace {
  id: number
  type: SpaceType
  group: number   // 0–7 para propiedades, -1 para especiales
  name: string
  price: number
  rents: [number, number, number, number, number, number]  // sin mejora, 1–4 PA, Centro
  hcost: number   // costo Punto de Atención
  // Runtime (mutable durante la partida)
  ownerId?: string | null
  buildings?: number  // 0–4 = PA, 5 = Centro de Servicio BFA
  mortgaged?: boolean
}

export interface Player {
  id: string
  name: string
  tokenId: TokenId
  balance: number
  position: number
  jailed: boolean
  jailTurns: number
  jailFreeCards: number
  bankrupt: boolean
  isAI: boolean
  difficulty: Difficulty
  properties: number[]
}

export interface Card {
  id: string
  type: 'cosecha' | 'riesgo'
  icon: string
  title: string
  text: string
  effect: CardEffect
}

export type CardEffect =
  | { action: 'collect'; amount: number }
  | { action: 'pay'; amount: number }
  | { action: 'move'; to: number }
  | { action: 'move_relative'; steps: number }
  | { action: 'jail_free' }
  | { action: 'go_to_jail' }
  | { action: 'pay_per_building'; house: number; hotel: number }
  | { action: 'collect_from_players'; amount: number }

export interface GameState {
  players: Player[]
  board: BoardSpace[]
  phase: GamePhase
  currentPlayerIndex: number
  turnCount: number
  doublesCount: number
  cosechaDeck: Card[]
  riesgoDeck: Card[]
  logEntries: LogEntry[]
  educationalMode: boolean
  winner: string | null
}

export interface LogEntry {
  turn: number
  playerName: string
  action: string
  amount?: number
  timestamp: number
}

export interface LandingResult {
  type: 'buy' | 'rent' | 'cosecha' | 'riesgo' | 'tax' | 'jail' | 'go' | 'free' | 'own'
  amount?: number
  card?: Card
  ownerId?: string
}

export interface BuildingResult {
  canBuild: boolean
  reason?: 'no_group' | 'not_balanced' | 'max_buildings' | 'mortgaged' | 'insufficient_funds'
}

export interface RentCalculation {
  amount: number
  multiplier?: number
}
