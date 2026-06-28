// Lightweight local-only player stats stored in localStorage.
// Used for adaptive onboarding (offer tutorial after 3 losses).

const STATS_KEY = 'agropoly:player_stats'

export interface LocalStats {
  totalGames:     number
  wins:           number
  consecutiveLosses: number
  tutorialOffered:   boolean   // we offered the tutorial at least once
  tutorialCompleted: boolean   // user finished the tutorial
}

const DEFAULTS: LocalStats = {
  totalGames: 0,
  wins: 0,
  consecutiveLosses: 0,
  tutorialOffered: false,
  tutorialCompleted: false,
}

function read(): LocalStats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw) as Partial<LocalStats>
    return { ...DEFAULTS, ...parsed }
  } catch {
    return { ...DEFAULTS }
  }
}

function write(s: LocalStats) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)) } catch { /* quota / safari private */ }
}

export function recordResult(won: boolean) {
  const s = read()
  s.totalGames += 1
  if (won) {
    s.wins += 1
    s.consecutiveLosses = 0
  } else {
    s.consecutiveLosses += 1
  }
  write(s)
}

export function getStats(): LocalStats {
  return read()
}

export function shouldOfferTutorial(): boolean {
  const s = read()
  return s.consecutiveLosses >= 3 && !s.tutorialOffered && !s.tutorialCompleted
}

export function markTutorialOffered() {
  const s = read()
  s.tutorialOffered = true
  write(s)
}

export function markTutorialCompleted() {
  const s = read()
  s.tutorialCompleted = true
  write(s)
}

export function resetStats() {
  write({ ...DEFAULTS })
}
