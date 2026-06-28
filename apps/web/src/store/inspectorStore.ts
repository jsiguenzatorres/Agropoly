import { create } from 'zustand'

interface InspectorStore {
  selectedSpaceId: number | null
  open:  (id: number) => void
  close: () => void
}

export const useInspectorStore = create<InspectorStore>((set) => ({
  selectedSpaceId: null,
  open:  (id) => set({ selectedSpaceId: id }),
  close: ()   => set({ selectedSpaceId: null }),
}))
