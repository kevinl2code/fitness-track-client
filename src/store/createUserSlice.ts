import { StateCreator } from 'zustand'
import { UserState } from '../model/Model'
import { RootSlice } from './useStore'

export interface UserSlice {
  userData: UserState | null
  bootstrapUser: (account: UserState) => void
  removeUser: () => void
}

export const createUserSlice: StateCreator<RootSlice, [], [], UserSlice> = (
  set,
  get
) => ({
  userData: null,
  bootstrapUser: (userData: UserState) => {
    set((prev) => ({
      ...prev.userSlice,
      userSlice: {
        ...prev.userSlice,
        userData: userData,
      },
    }))
  },
  removeUser: () => {
    set((prev) => {
      return { ...prev, userData: null }
    })
  },
})
