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

export interface EntryConsumable {
  name: string
  calories: number
  protein: number
  fat: number
  carbohydrates: number
}

export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTRA_ACTIVE'

//PK should be the users ID -- cognito sub value
//SK should be the entry date, written using ISO 8601(yyyymmdd) strings such as 20190823
//GSI1PK should be in format C_cycleId
export interface DailyEntry {
  PK: string
  SK: string
  GSI1PK: string
  GSI1SK: 'DAILYENTRIES'
  type: 'DAILYENTRY'
  dailyEntryWeight: number
  dailyEntryConsumables: EntryConsumable[] | []
  dailyEntryActivityLevel: ActivityLevel
  entryDate: string
  cycleId: string
}

export type Sex = 'male' | 'female'

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

// export type CycleType = 'CUT' | 'BULK' | 'MAINTAIN'

export enum CycleType {
  CUT = 'CUT',
  BULK = 'BULK',
  MAINTAIN = 'MAINTAIN',
}

//PK should be the users ID -- cognito sub value
//SK should be in format C_cycleId
//GSI2PK should be in format U_userId
export interface Cycle {
  PK: string
  SK: string
  GSI2PK: string
  GSI2SK: 'CYCLES'
  type: 'CYCLE'
  cycleType: CycleType
  startingWeight: number
  endingWeight: number | null
  goalWeight: number
  startDate: string
  endingDate: string | null
  duration: number
  isActive: boolean
  cycleId: string
}

export interface NutritionalLibraryItem {
  name: string
  caloriesPerGram: number
  proteinPerGram: number
  servingSize: number
}

// export type UserItem = Cycle | DailyEntry

export type FoodSubCategory = {
  PK: 'SUBCATEGORIES'
  SK: string
  GSI2PK: string
  GSI2SK: 'METADATA'
  type: 'SUBCATEGORY'
  name: string
  categoryId: string
  subCategoryId: string
}

export type FoodCategory = {
  PK: 'CATEGORIES'
  SK: string
  categoryId: string
  name: string
  type: 'CATEGORY'
}

export type FoodItemUnits = 'GRAMS' | 'OUNCES' | 'EACH'

//PK should be in format F#<foodItemId>
//GSI1PK should be in format C#<categoryId>
//GSI1SK should be in format S#<subCategoryId>#F#<foodItemId>
export interface FitnessTrackFoodItem {
  PK: string
  SK: 'METADATA'
  GSI1PK: string
  GSI1SK: string
  type: 'FOOD'
  foodItemName: string
  foodItemUnit: FoodItemUnits
  servingSize: number
  calories: number
  protein: number
  fat: number
  carbohydrates: number
  categoryId: string
  subCategoryId: string
  foodItemId: string
}
