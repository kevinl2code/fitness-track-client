import create, { StateCreator } from 'zustand'
import {
  createCredentialsSlice,
  CredentialsSlice,
} from './createCredentialsSlice'
import { createCycleListSlice, CycleListSlice } from './createCycleListSlice'
import { createEntriesSlice, EntriesSlice } from './createEntriesSlice'
import {
  createSelectedCycleSlice,
  SelectedCycleSlice,
} from './createSelectedCycleSlice'
import {
  createUserFoodItemsSlice,
  UserFoodItemsSlice,
} from './createUserFoodItemsSlice'
import { createUserSlice, UserSlice } from './createUserSlice'

export type RootSlice = {
  selectedCycleSlice: SelectedCycleSlice
  cycleListSlice: CycleListSlice
  entriesSlice: EntriesSlice
  userSlice: UserSlice
  credentialsSlice: CredentialsSlice
  userFoodItemsSlice: UserFoodItemsSlice
}

const createRootSlice: StateCreator<RootSlice, [], [], RootSlice> = (
  set,
  get,
  api
) => ({
  selectedCycleSlice: { ...createSelectedCycleSlice(set, get, api, []) },
  cycleListSlice: { ...createCycleListSlice(set, get, api, []) },
  entriesSlice: { ...createEntriesSlice(set, get, api, []) },
  userSlice: { ...createUserSlice(set, get, api, []) },
  credentialsSlice: { ...createCredentialsSlice(set, get, api, []) },
  userFoodItemsSlice: { ...createUserFoodItemsSlice(set, get, api, []) },
})

export const useStore = create(createRootSlice)
