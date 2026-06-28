import { create } from 'zustand'
import type { Achievement } from '../lib/achievements'

interface QueueItem extends Achievement {
  ts: number   // unique key
}

interface AchievementToastStore {
  queue: QueueItem[]
  push: (a: Achievement) => void
  pop: () => void
}

let counter = 0

export const useAchievementToastStore = create<AchievementToastStore>((set) => ({
  queue: [],
  push: (a) => set(state => ({ queue: [...state.queue, { ...a, ts: ++counter }] })),
  pop:  () => set(state => ({ queue: state.queue.slice(1) })),
}))

// Helper: dispatch (null = nothing to do, achievement = push to toast queue)
export function dispatchUnlock(a: Achievement | null) {
  if (a) useAchievementToastStore.getState().push(a)
}
export function dispatchUnlocks(achievements: (Achievement | null)[]) {
  achievements.forEach(a => { if (a) useAchievementToastStore.getState().push(a) })
}
