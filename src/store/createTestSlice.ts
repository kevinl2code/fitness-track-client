import { StateCreator } from 'zustand'
import { Cycle } from '../model/Model'
import { RootSlice } from './useStore'

export interface TestSlice {
  testBool: string
  setTestBool: () => void
}

export const createTestSlice: StateCreator<RootSlice, [], [], TestSlice> = (
  set,
  get
) => ({
  testBool: 'wolf',
  setTestBool: () =>
    set((prev) => ({
      ...prev,
      testSlice: { ...prev.testSlice, testBool: 'coyote' },
    })),
})
