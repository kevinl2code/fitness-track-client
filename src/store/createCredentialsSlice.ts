import { StateCreator } from 'zustand'
import { UserCredentials } from '../model/Model'
import { RootSlice } from './useStore'

export interface CredentialsSlice {
  credentials: UserCredentials | null
  setCredentials: (credentials: UserCredentials) => void
  removeCredentials: () => void
}

export const createCredentialsSlice: StateCreator<
  RootSlice,
  [],
  [],
  CredentialsSlice
> = (set, get) => ({
  credentials: null,
  setCredentials: (credentials: UserCredentials) => {
    set((prev) => ({
      ...prev,
      credentialsSlice: {
        ...prev.credentialsSlice,
        credentials: credentials,
      },
    }))
  },
  removeCredentials: () => {
    set((prev) => {
      console.log('hookRemoveran')
      return {
        ...prev,
        credentialsSlice: {
          ...prev.credentialsSlice,
          credentials: null,
        },
      }
    })
  },
})
