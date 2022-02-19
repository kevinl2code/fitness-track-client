import { config } from 'aws-sdk'
import {
  Cycle,
  DailyEntry,
  EntryConsumable,
  FitnessTrackFoodItem,
  FoodCategory,
  FoodSubCategory,
  User,
} from '../model/Model'

config.update({
  region: process.env.REACT_APP_REGION,
})

export class DataService {
  private user: User | undefined
  private userIdToken: string | undefined

  private getUserIdToken() {
    if (this.user) {
      return this.user.cognitoUser
        .getSignInUserSession()!
        .getIdToken()
        .getJwtToken()
    } else {
      return ''
    }
  }
  public setUser(user: User) {
    this.user = user
    this.userIdToken = this.getUserIdToken()
  }

  public async createDailyEntry(dailyEntry: DailyEntry) {
    const requestUrl = process.env.REACT_APP_API_USER!
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify(dailyEntry),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return JSON.stringify(resultJSON.id)
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async updateDailyEntry(updatedDailyEntry: DailyEntry) {
    const requestUrl = `${process.env.REACT_APP_API_USER}?PK=${updatedDailyEntry.PK}&SK=${updatedDailyEntry.SK}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ ...updatedDailyEntry }),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return JSON.stringify(resultJSON)
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async createUserCycle(cycle: Cycle) {
    const requestUrl = process.env.REACT_APP_API_USER!
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify(cycle),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      return resultJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async updateUserCycle(updatedCycle: Cycle) {
    const requestUrl = `${process.env.REACT_APP_API_USER!}?PK=${
      updatedCycle.PK
    }&SK=${updatedCycle.SK}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ ...updatedCycle }),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return resultJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async getUserCycles(userId: string): Promise<Cycle[] | undefined> {
    try {
      if (this.user) {
        const requestUrl = `${process.env
          .REACT_APP_API_USER!}?GSI2PK=U_${userId}&SGSI2SK=CYCLES`
        const requestResult = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            Authorization: this.getUserIdToken(),
          },
        })
        const responseJSON = await requestResult.json()
        // console.log(responseJSON)
        return responseJSON
      } else {
        return []
      }
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async getDailyEntriesForCycle(
    cycleId: string
  ): Promise<DailyEntry[] | undefined> {
    try {
      if (this.user) {
        const requestUrl = `${process.env
          .REACT_APP_API_USER!}?GSI1PK=C_${cycleId}&GSI1SK=DAILYENTRIES`
        const requestResult = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            Authorization: this.getUserIdToken(),
          },
        })
        const responseJSON = await requestResult.json()
        // console.log(responseJSON)
        return responseJSON
      } else {
        return []
      }
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async getDailyEntryByDate(
    userId: string,
    date: string
  ): Promise<DailyEntry[] | undefined> {
    const requestUrl = `${process.env.REACT_APP_API_USER}?PK=${userId}&SK=${date}`
    const requestResult = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: this.getUserIdToken(),
      },
    })
    try {
      const responseJSON = await requestResult.json()
      // console.log(responseJSON)
      return responseJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async updateDailyEntryConsumables(
    userId: string,
    date: string,
    updatedDailyEntry: EntryConsumable[]
  ) {
    try {
      const requestUrl = `${process.env.REACT_APP_API_USER}?PK=${userId}&SK=${date}`
      const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {
          Authorization: this.getUserIdToken(),
        },
        body: JSON.stringify({ dailyEntryConsumables: updatedDailyEntry }),
      }
      const result = await fetch(requestUrl, requestOptions)

      const resultJSON = await result.json()
      // console.log(resultJSON)
      return resultJSON.Attributes.dailyEntryConsumables
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async updateDailyEntryActivityLevel(
    userId: string,
    date: string,
    updatedDailyEntry: string
  ) {
    const requestUrl = `${process.env.REACT_APP_API_USER}?PK=${userId}&SK=${date}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ dailyEntryActivityLevel: updatedDailyEntry }),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)

      const resultJSON = await result.json()
      // console.log(resultJSON)
      return resultJSON.Attributes.dailyEntryActivityLevel
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async getFoodCategories() {
    const requestUrl = `${process.env.REACT_APP_API_FOODS}?PK=CATEGORIES`

    try {
      const requestResult = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: this.getUserIdToken(),
        },
      })
      const responseJSON = await requestResult.json()
      // console.log(responseJSON)
      return responseJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }
  public async getFoodSubCategories(categoryId: string) {
    const requestUrl = `${process.env.REACT_APP_API_FOODS}?GSI2PK=C_${categoryId}&GSI2SK=METADATA`

    try {
      const requestResult = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: this.getUserIdToken(),
        },
      })
      const responseJSON = await requestResult.json()
      // console.log(responseJSON)
      return responseJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async getFoodItems(categoryId: string, subCategoryId: string) {
    const requestUrl = `${process.env.REACT_APP_API_FOODS}?GSI1PK=C_${categoryId}&GSI1SK=S_${subCategoryId}`
    try {
      const requestResult = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: this.getUserIdToken(),
        },
      })
      const responseJSON = await requestResult.json()
      // console.log(responseJSON)
      return responseJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async createFoodItem(newFoodItem: FitnessTrackFoodItem) {
    const requestUrl = process.env.REACT_APP_API_FOODS!
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify(newFoodItem),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return JSON.stringify(resultJSON.id)
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async deleteFoodItem(foodItemId: string) {
    const requestUrl = `${process.env
      .REACT_APP_API_FOODS!}?PK=F_${foodItemId}&SK=METADATA`
    try {
      const requestResult = await fetch(requestUrl, {
        method: 'DELETE',
        headers: {
          Authorization: this.getUserIdToken(),
        },
      })
      const responseJSON = await requestResult.json()
      // console.log(responseJSON)
      return responseJSON
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async updateFoodItem(updatedFoodItem: FitnessTrackFoodItem) {
    const requestUrl = `${process.env.REACT_APP_API_FOODS}?PK=${updatedFoodItem.PK}&SK=${updatedFoodItem.SK}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ ...updatedFoodItem }),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return JSON.stringify(resultJSON)
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }

  public async createFoodCategory(newFoodCategory: FoodCategory) {
    const userIdToken = this.getUserIdToken()
    const requestUrl = process.env.REACT_APP_API_FOODS!
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: userIdToken,
      },
      body: JSON.stringify(newFoodCategory),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return JSON.stringify(resultJSON)
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }
  public async createFoodSubCategory(newFoodSubCategory: FoodSubCategory) {
    const requestUrl = process.env.REACT_APP_API_FOODS!
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify(newFoodSubCategory),
    }
    try {
      const result = await fetch(requestUrl, requestOptions)
      const resultJSON = await result.json()
      // console.log(resultJSON)
      return JSON.stringify(resultJSON.name)
    } catch (error) {
      console.log({ dataServiceError: error })
    }
  }
}
