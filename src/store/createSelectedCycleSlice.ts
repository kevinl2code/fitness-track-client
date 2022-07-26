import { StateCreator } from 'zustand'
import { Cycle } from '../model/Model'
import { RootSlice } from './useStore'

export interface SelectedCycleSlice {
  selectedCycle: Cycle | null
  setSelectedCycle: (cycle: Cycle | null) => void
}

export const createSelectedCycleSlice: StateCreator<
  RootSlice,
  [],
  [],
  SelectedCycleSlice
> = (set, get) => ({
  selectedCycle: null,
  setSelectedCycle: (cycle: Cycle | null) => {
    set((prev) => ({
      ...prev,
      selectedCycleSlice: {
        ...prev.selectedCycleSlice,
        selectedCycle: cycle,
      },
    }))
  },
})
