import create, { StateCreator } from 'zustand'
import { createCycleListSlice, CycleListSlice } from './createCycleListSlice'
import {
  createSelectedCycleSlice,
  SelectedCycleSlice,
} from './createSelectedCycleSlice'

export type RootSlice = {
  selectedCycleSlice: SelectedCycleSlice
  cycleListSlice: CycleListSlice
}

const createRootSlice: StateCreator<RootSlice, [], [], RootSlice> = (
  set,
  get,
  api
) => ({
  selectedCycleSlice: { ...createSelectedCycleSlice(set, get, api, []) },
  cycleListSlice: { ...createCycleListSlice(set, get, api, []) },
})

export const useStore = create(createRootSlice)
