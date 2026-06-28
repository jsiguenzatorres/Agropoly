import { create } from 'zustand'

export interface FlightCoin {
  id: number
  fromId: string    // player id (used to find DOM rect of their scoreboard chip)
  toId:   string    // 'bank' for taxes/cards or player id for rent/trade
  amount: number
}

interface MoneyFlowStore {
  flights: FlightCoin[]
  emit:    (fromId: string, toId: string, amount: number) => void
  done:    (id: number) => void
}

let counter = 0

export const useMoneyFlowStore = create<MoneyFlowStore>((set) => ({
  flights: [],
  emit: (fromId, toId, amount) => set(s => ({
    flights: [...s.flights, { id: ++counter, fromId, toId, amount }],
  })),
  done: (id) => set(s => ({ flights: s.flights.filter(f => f.id !== id) })),
}))

export function emitMoneyFlow(fromId: string, toId: string, amount: number) {
  if (amount <= 0) return
  useMoneyFlowStore.getState().emit(fromId, toId, amount)
}
