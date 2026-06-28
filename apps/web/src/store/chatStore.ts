import { create } from 'zustand'

export interface ChatMessage {
  fromId: string
  fromName: string
  text: string
  ts: number
}

export interface ReactionEvent {
  id: number
  fromName: string
  emoji: string
}

interface ChatStore {
  messages: ChatMessage[]
  reactions: ReactionEvent[]      // floating reactions, expire after a few seconds
  unread: number
  open: boolean

  appendMessage: (m: ChatMessage) => void
  appendReaction: (r: Omit<ReactionEvent, 'id'>) => void
  dropReaction: (id: number) => void
  setOpen: (v: boolean) => void
  clearUnread: () => void
  reset: () => void
}

let counter = 0

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  reactions: [],
  unread: 0,
  open: false,

  appendMessage: (m) => set(s => {
    const messages = [...s.messages, m].slice(-50)  // keep last 50
    return { messages, unread: s.open ? 0 : s.unread + 1 }
  }),
  appendReaction: (r) => set(s => ({
    reactions: [...s.reactions, { ...r, id: ++counter }],
  })),
  dropReaction: (id) => set(s => ({ reactions: s.reactions.filter(r => r.id !== id) })),
  setOpen: (v) => set({ open: v, unread: v ? 0 : 0 }),
  clearUnread: () => set({ unread: 0 }),
  reset: () => set({ messages: [], reactions: [], unread: 0, open: false }),
}))
