import { StateCreator } from 'zustand'
import { DailyEntry } from '../model/Model'
import { RootSlice } from './useStore'

export interface EntriesSlice {
  entries: DailyEntry[]
  setEntries: (entries: DailyEntry[]) => void
}

export const createEntriesSlice: StateCreator<
  RootSlice,
  [],
  [],
  EntriesSlice
> = (set, get) => ({
  entries: [],
  setEntries: (entries: DailyEntry[]) => {
    set((prev) => ({
      ...prev,
      entriesSlice: {
        ...prev.entriesSlice,
        entries: entries,
      },
    }))
  },
})
