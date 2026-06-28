// Brief visual highlight (shake red for loss, bounce gold for gain) applied to
// a player's scoreboard chip when they pay/receive money. Auto-clears after 1.4s.

import { create } from 'zustand'

export type ChipFx = 'loss' | 'gain'

interface ChipFxStore {
  fx: Record<string, ChipFx>          // playerId → fx kind
  flash: (playerId: string, kind: ChipFx) => void
  clear: (playerId: string) => void
}

export const useChipFxStore = create<ChipFxStore>((set) => ({
  fx: {},
  flash: (playerId, kind) => {
    set(s => ({ fx: { ...s.fx, [playerId]: kind } }))
    setTimeout(() => {
      set(s => {
        const next = { ...s.fx }
        delete next[playerId]
        return { fx: next }
      })
    }, 1400)
  },
  clear: (playerId) => set(s => {
    const next = { ...s.fx }
    delete next[playerId]
    return { fx: next }
  }),
}))
