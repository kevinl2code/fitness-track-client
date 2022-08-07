import { StateCreator } from 'zustand'
import { UserFoodItem } from '../model/Model'
import { RootSlice } from './useStore'

export interface UserFoodItemsSlice {
  userFoodItems: UserFoodItem[]
  setUserFoodItems: (userFoodItems: UserFoodItem[]) => void
}

export const createUserFoodItemsSlice: StateCreator<
  RootSlice,
  [],
  [],
  UserFoodItemsSlice
> = (set, get) => ({
  userFoodItems: [],
  setUserFoodItems: (userFoodItems: UserFoodItem[]) => {
    set((prev) => ({
      ...prev.userFoodItemsSlice,
      userFoodItemsSlice: {
        ...prev.userFoodItemsSlice,
        userFoodItems: userFoodItems,
      },
    }))
  },
})
