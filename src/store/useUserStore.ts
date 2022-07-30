import create, { StateCreator } from 'zustand'
import { merge } from 'lodash'
import { persist } from 'zustand/middleware'
import { UserState } from '../model/Model'

interface UserSlice {
  userData: UserState | null
  bootstrapUser: (account: UserState) => void
  removeUser: () => void
}

const userSlice: StateCreator<
  UserSlice,
  [['zustand/persist', unknown]],
  [],
  UserSlice
> = (set, get) => ({
  userData: null,
  bootstrapUser: (userData: UserState) => {
    set((prev) => ({ ...prev, userData }))
  },
  removeUser: () => {
    set((prev) => ({ ...prev, userData: null }))
  },
})

const persistedUserSlice = persist(userSlice, {
  name: 'auth-store',
  merge: (persistedState, currentState) => merge(currentState, persistedState),
})

export const useUserStore = create(persistedUserSlice)
