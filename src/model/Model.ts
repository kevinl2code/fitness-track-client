import { CognitoUser } from '@aws-amplify/auth'

export interface User {
  userName: string
  cognitoUser: CognitoUser
  isAdmin: boolean
}

export interface UserAttribute {
  Name: string
  Value: string
}

export interface EntryMeal {
  name: string
  calories: number
  protein: number
}

export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTRA_ACTIVE'

export interface DailyEntry {
  dailyEntryId: string
  date: string
  weight: number
  meals: EntryMeal[] | []
  activityLevel: ActivityLevel
}

export type Sex = 'MALE' | 'FEMALE'

export type CognitoGender = 'male' | 'female'

export interface UserState {
  user: User
  firstName: string
  lastName: string
  sex: CognitoGender
  height: number
  birthday: string
  email: string
  sub: string
}

export type CycleType = 'CUT' | 'BULK' | 'MAINTAIN'

export interface Cycle {
  cycleType: CycleType
  startingWeight: number
  goalWeight: number
  startDate: string
  duration: number
}

export interface NutritionalLibraryItem {
  name: string
  caloriesPerGram: number
  proteinPerGram: number
  servingSize: number
}
