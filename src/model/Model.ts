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

export interface Meal {
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
  meals: Meal[] | []
  activityLevel: ActivityLevel
}

export type Sex = 'MALE' | 'FEMALE'

export type CognitoGender = 'male' | 'female'
