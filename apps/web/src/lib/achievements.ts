// Achievements system — local-only, persisted in localStorage.
// Catalogo + criterio de unlock + storage helpers.

import { getStats } from './stats'

const STORAGE_KEY = 'agropoly:achievements'

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  primer_propietario: {
    id: 'primer_propietario',
    icon: '🏠',
    title: 'Primer Propietario',
    description: 'Comprá tu primera propiedad.',
  },
  monopolio_occidente: {
    id: 'monopolio_occidente',
    icon: '🟣',
    title: 'Monopolio de Occidente',
    description: 'Completá el grupo Occidente I (Ahuachapán + Atiquizaya).',
  },
  rey_capital: {
    id: 'rey_capital',
    icon: '👑',
    title: 'Rey de la Capital',
    description: 'Completá el grupo Casa Matriz (más alto del tablero).',
  },
  constructor_bfa: {
    id: 'constructor_bfa',
    icon: '🏨',
    title: 'Constructor BFA',
    description: 'Construí 5 Centros de Servicio BFA (hoteles) en total.',
  },
  sobreviviente: {
    id: 'sobreviviente',
    icon: '💪',
    title: 'Sobreviviente',
    description: 'Ganá una partida sin haber sido hipotecado nunca.',
  },
  educador: {
    id: 'educador',
    icon: '🎓',
    title: 'Educador',
    description: 'Respondé 10 quizes correctamente en modo educativo.',
  },
  amigo_vaquita: {
    id: 'amigo_vaquita',
    icon: '🐄',
    title: 'Amigo de La Vaquita',
    description: 'Jugá 5 partidas con el modo educativo BFA activado.',
  },
  experto_financiero: {
    id: 'experto_financiero',
    icon: '💎',
    title: 'Experto Financiero',
    description: 'Alcanzá ƒ5,000 de patrimonio neto en una partida.',
  },
}

export type AchievementId = keyof typeof ACHIEVEMENTS

interface AchievementState {
  unlocked: Record<string, number>  // achievementId → unlockedAt (ms)
  counters: {
    hotelsTotal: number
    quizCorrectTotal: number
    eduGamesTotal: number
  }
}

const DEFAULTS: AchievementState = {
  unlocked: {},
  counters: { hotelsTotal: 0, quizCorrectTotal: 0, eduGamesTotal: 0 },
}

function read(): AchievementState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS, counters: { ...DEFAULTS.counters }, unlocked: {} }
    const parsed = JSON.parse(raw) as Partial<AchievementState>
    return {
      unlocked: parsed.unlocked ?? {},
      counters: { ...DEFAULTS.counters, ...(parsed.counters ?? {}) },
    }
  } catch {
    return { ...DEFAULTS, counters: { ...DEFAULTS.counters }, unlocked: {} }
  }
}

function write(s: AchievementState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

export function getUnlocked(): Set<string> {
  return new Set(Object.keys(read().unlocked))
}

export function getAllAchievementsWithStatus(): Array<Achievement & { unlocked: boolean; unlockedAt?: number }> {
  const state = read()
  return Object.values(ACHIEVEMENTS).map(a => ({
    ...a,
    unlocked: !!state.unlocked[a.id],
    unlockedAt: state.unlocked[a.id],
  }))
}

// Unlocks an achievement if not already unlocked. Returns the achievement if newly unlocked.
export function unlock(id: AchievementId): Achievement | null {
  const state = read()
  if (state.unlocked[id]) return null
  state.unlocked[id] = Date.now()
  write(state)
  return ACHIEVEMENTS[id]
}

// Counter helpers
export function bumpHotel(): Achievement | null {
  const s = read()
  s.counters.hotelsTotal++
  write(s)
  if (s.counters.hotelsTotal >= 5) return unlock('constructor_bfa')
  return null
}
export function bumpQuizCorrect(): Achievement | null {
  const s = read()
  s.counters.quizCorrectTotal++
  write(s)
  if (s.counters.quizCorrectTotal >= 10) return unlock('educador')
  return null
}
export function bumpEduGame(): Achievement | null {
  const s = read()
  s.counters.eduGamesTotal++
  write(s)
  if (s.counters.eduGamesTotal >= 5) return unlock('amigo_vaquita')
  return null
}

// End-of-game checks (called from VictoryScreen)
export function checkGameEndUnlocks(opts: {
  isWinner: boolean
  netWorth: number
  wasMortgaged: boolean
  hadEduMode: boolean
}): Achievement[] {
  const newly: Achievement[] = []
  if (opts.netWorth >= 5000) {
    const a = unlock('experto_financiero')
    if (a) newly.push(a)
  }
  if (opts.isWinner && !opts.wasMortgaged) {
    const a = unlock('sobreviviente')
    if (a) newly.push(a)
  }
  if (opts.hadEduMode) {
    const a = bumpEduGame()
    if (a) newly.push(a)
  }
  // Also pull from per-game checks already unlocked (no-op since already unlocked)
  return newly
}

// Mid-game unlocks (called from gameStore / GameHUD on relevant events)
export function unlockFirstProperty(): Achievement | null {
  return unlock('primer_propietario')
}

// group 0 = Occidente I, group 7 = Casa Matriz
export function unlockGroupComplete(group: number): Achievement | null {
  if (group === 0) return unlock('monopolio_occidente')
  if (group === 7) return unlock('rey_capital')
  return null
}

// Reset (debug only)
export function resetAchievements() {
  write({ ...DEFAULTS, counters: { ...DEFAULTS.counters }, unlocked: {} })
}

// Stats consumer for the achievements view
export function getStatsForView() {
  const s = read()
  const local = getStats()
  return {
    unlocked: Object.keys(s.unlocked).length,
    total: Object.keys(ACHIEVEMENTS).length,
    counters: s.counters,
    games: local.totalGames,
    wins: local.wins,
  }
}
