import create, { StateCreator } from 'zustand'
import { createCycleListSlice, CycleListSlice } from './createCycleListSlice'
import { createEntriesSlice, EntriesSlice } from './createEntriesSlice'
import {
  createSelectedCycleSlice,
  SelectedCycleSlice,
} from './createSelectedCycleSlice'

export type RootSlice = {
  selectedCycleSlice: SelectedCycleSlice
  cycleListSlice: CycleListSlice
  entriesSlice: EntriesSlice
}

const createRootSlice: StateCreator<RootSlice, [], [], RootSlice> = (
  set,
  get,
  api
) => ({
  selectedCycleSlice: { ...createSelectedCycleSlice(set, get, api, []) },
  cycleListSlice: { ...createCycleListSlice(set, get, api, []) },
  entriesSlice: { ...createEntriesSlice(set, get, api, []) },
})

export const useStore = create(createRootSlice)
