import create, { StateCreator } from 'zustand'
import { createCycleListSlice, CycleListSlice } from './createCycleListSlice'
import {
  createSelectedCycleSlice,
  SelectedCycleSlice,
} from './createSelectedCycleSlice'
import { createTestSlice, TestSlice } from './createTestSlice'

export type RootSlice = {
  selectedCycleSlice: SelectedCycleSlice
  cycleListSlice: CycleListSlice
  testSlice: TestSlice
}

const createRootSlice: StateCreator<RootSlice, [], [], RootSlice> = (
  set,
  get,
  api
) => ({
  selectedCycleSlice: { ...createSelectedCycleSlice(set, get, api, []) },
  cycleListSlice: { ...createCycleListSlice(set, get, api, []) },
  testSlice: { ...createTestSlice(set, get, api, []) },
})

export const useStore = create(createRootSlice)
