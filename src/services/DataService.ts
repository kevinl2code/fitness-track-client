import { config } from 'aws-sdk'
import { ICreateDailyEntry } from '../components/DailyEntryCreateNew/DailyEntryCreateNew'
import { DailyEntry, EntryMeal, User } from '../model/Model'

config.update({
  region: process.env.REACT_APP_REGION,
})

export class DataService {
  private user: User | undefined

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
  }

  public async createDailyEntry(iCreateDailyEntry: ICreateDailyEntry) {
    const requestUrl = process.env.REACT_APP_API_DAILY_ENTRIES!
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify(iCreateDailyEntry),
    }
    const result = await fetch(requestUrl, requestOptions)
    const resultJSON = await result.json()
    return JSON.stringify(resultJSON.id)
  }

  public async getDailyEntries(): Promise<DailyEntry[]> {
    if (this.user) {
      const requestUrl = process.env.REACT_APP_API_DAILY_ENTRIES!
      const requestResult = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: this.getUserIdToken(),
        },
      })
      const responseJSON = await requestResult.json()
      return responseJSON
    } else {
      return []
    }
  }

  public async getDailyEntryByDate(
    userId: string,
    date: string
  ): Promise<DailyEntry[]> {
    const requestUrl = `${process.env.REACT_APP_API_DAILY_ENTRIES}?userId=${userId}&sortKey=${date}`
    const requestResult = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: this.getUserIdToken(),
      },
    })
    const responseJSON = await requestResult.json()
    return responseJSON
  }

  public async updateDailyEntryMeals(
    userId: string,
    date: string,
    updatedDailyEntry: EntryMeal[]
  ) {
    const requestUrl = `${process.env.REACT_APP_API_DAILY_ENTRIES}?userId=${userId}&sortKey=${date}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ dailyEntryMeals: updatedDailyEntry }),
    }
    const result = await fetch(requestUrl, requestOptions)

    const resultJSON = await result.json()
    return resultJSON.Attributes.dailyEntryMeals
  }

  public async updateDailyEntryWeight(
    userId: string,
    date: string,
    updatedDailyEntryWeight: number
  ) {
    const requestUrl = `${process.env.REACT_APP_API_DAILY_ENTRIES}?userId=${userId}&sortKey=${date}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ dailyEntryWeight: updatedDailyEntryWeight }),
    }
    console.log(requestOptions)
    const result = await fetch(requestUrl, requestOptions)

    const resultJSON = await result.json()
    return resultJSON.Attributes.dailyEntryWeight
  }

  public async updateDailyEntryActivityLevel(
    userId: string,
    date: string,
    updatedDailyEntry: string
  ) {
    const requestUrl = `${process.env.REACT_APP_API_DAILY_ENTRIES}?userId=${userId}&sortKey=${date}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      headers: {
        Authorization: this.getUserIdToken(),
      },
      body: JSON.stringify({ dailyEntryActivityLevel: updatedDailyEntry }),
    }
    const result = await fetch(requestUrl, requestOptions)

    const resultJSON = await result.json()
    return resultJSON.Attributes.dailyEntryActivityLevel
  }
}
