import { StateCreator } from 'zustand'
import { Cycle } from '../model/Model'
import { RootSlice } from './useStore'

export interface CycleListSlice {
  cycleList: Cycle[]
  setCycleList: (cycleList: Cycle[]) => void
}

export const createCycleListSlice: StateCreator<
  RootSlice,
  [],
  [],
  CycleListSlice
> = (set, get) => ({
  cycleList: [],
  setCycleList: (cycleList: Cycle[]) => {
    set((prev) => ({
      ...prev,
      cycleListSlice: {
        ...prev.cycleListSlice,
        cycleList: cycleList,
      },
    }))
  },
})
