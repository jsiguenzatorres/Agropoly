// Re-exports game-engine types for consumers that don't depend on the full engine
export type {
  GamePhase,
  Difficulty,
  TokenId,
  MascotId,
  Emotion,
  SpaceType,
  BoardSpace,
  Player,
  Card,
  CardEffect,
  GameState,
  LogEntry,
  LandingResult,
  BuildingResult,
  RentCalculation,
} from '@agropoly/game-engine'

// API types (client ↔ server)
export interface VoiceRequest {
  mascot: MascotId
  text: string
  emotion: Emotion
}

export interface VoiceResponse {
  url: string
  cached: boolean
  duration: number
}

export interface MascotDialogue {
  mascot: MascotId
  text: string
  emotion: Emotion
}

export interface EducationLesson {
  concept: string
  explanation: string
  realWorldExample: string
  bfaContext: string
  followUpQuestion: string
}

export interface LeaderboardEntry {
  rank: number
  playerName: string
  netWorth: number
  sessionId: string
  gameDate: string
}

// Re-export MascotId for convenience
import type { MascotId } from '@agropoly/game-engine'
