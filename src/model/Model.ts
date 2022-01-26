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
  userId: string
  sortKey: string
  dailyEntryWeight: number
  dailyEntryMeals: EntryMeal[] | []
  dailyEntryActivityLevel: ActivityLevel
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

export interface Cycle {
  userId: string
  sortKey: string
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

export type UserItem = Cycle | DailyEntry

export type SubCategoryListItem = {
  name: string
  subCategoryId: string
}

export type Category = {
  PK: 'CATEGORIES'
  SK: string
  categoryId: string
  name: string
  subCategories: SubCategoryListItem[]
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
