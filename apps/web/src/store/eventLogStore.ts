import { create } from 'zustand'

export interface LogEntry {
  id: number
  ts: number
  text: string
  icon?: string
  amount?: number   // signed (positive = gain, negative = loss)
}

interface EventLogStore {
  entries: LogEntry[]
  open: boolean
  push: (text: string, opts?: { icon?: string; amount?: number }) => void
  clear: () => void
  setOpen: (v: boolean) => void
}

let counter = 0

export const useEventLogStore = create<EventLogStore>((set) => ({
  entries: [],
  open: false,
  push: (text, opts) => set(state => ({
    entries: [...state.entries, {
      id: ++counter, ts: Date.now(), text,
      icon: opts?.icon, amount: opts?.amount,
    }].slice(-100),
  })),
  clear: () => set({ entries: [] }),
  setOpen: (v) => set({ open: v }),
}))

export function logEvent(text: string, opts?: { icon?: string; amount?: number }) {
  useEventLogStore.getState().push(text, opts)
}
