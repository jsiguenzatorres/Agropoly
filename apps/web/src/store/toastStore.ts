import { create } from 'zustand'

export type ToastKind = 'info' | 'success' | 'warning' | 'error' | 'money_in' | 'money_out'

export interface Toast {
  id: number
  kind: ToastKind
  text: string
  ttl: number  // ms
}

interface ToastStore {
  toasts: Toast[]
  push: (kind: ToastKind, text: string, ttl?: number) => void
  pop:  (id: number) => void
}

let counter = 0

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (kind, text, ttl = 2500) => set(state => ({
    toasts: [...state.toasts, { id: ++counter, kind, text, ttl }].slice(-8),
  })),
  pop: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

export function toast(kind: ToastKind, text: string, ttl?: number) {
  useToastStore.getState().push(kind, text, ttl)
}
export function toastMoneyIn(amount: number, reason?: string) {
  toast('money_in', `+ƒ${amount.toLocaleString()}${reason ? ` · ${reason}` : ''}`, 2000)
}
export function toastMoneyOut(amount: number, reason?: string) {
  toast('money_out', `−ƒ${amount.toLocaleString()}${reason ? ` · ${reason}` : ''}`, 2200)
}
