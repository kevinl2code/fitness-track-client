import { config } from 'aws-sdk'
import { ICreateDailyEntry } from '../components/DailyEntryCreateNew/DailyEntryCreateNew'
import { DailyEntry, Meal } from '../model/Model'

config.update({
  region: process.env.REACT_APP_REGION,
})

export class DataService {
  public async createDailyEntry(iCreateDailyEntry: ICreateDailyEntry) {
    const requestUrl = process.env.REACT_APP_API_DAILY_ENTRIES!
    const requestOptions: RequestInit = {
      method: 'POST',
      body: JSON.stringify(iCreateDailyEntry),
    }
    const result = await fetch(requestUrl, requestOptions)
    const resultJSON = await result.json()

    return JSON.stringify(resultJSON.id)
  }

  public async getDailyEntries(): Promise<DailyEntry[]> {
    // if (this.user) {
    //     console.log(`Using token: ${this.getUserIdToken()}`)
    const requestUrl = process.env.REACT_APP_API_DAILY_ENTRIES!
    const requestResult = await fetch(requestUrl, {
      method: 'GET',
      // headers: {
      //     'Authorization': this.getUserIdToken()
      // }
    })
    const responseJSON = await requestResult.json()
    return responseJSON
    // } else {
    //     return []
    // }
  }

  public async getDailyEntryByDate(date: string): Promise<DailyEntry[]> {
    const requestUrl = `${process.env.REACT_APP_API_DAILY_ENTRIES}?date=${date}`
    const requestResult = await fetch(requestUrl, {
      method: 'GET',
      // headers: {
      //     'Authorization': this.getUserIdToken()
      // }
    })
    const responseJSON = await requestResult.json()
    return responseJSON
  }

  public async updateDailyEntryMeals(
    dailyEntryId: string,
    updatedDailyEntry: Meal[]
  ) {
    const requestUrl = `${process.env.REACT_APP_API_DAILY_ENTRIES}?dailyEntryId=${dailyEntryId}`
    const requestOptions: RequestInit = {
      method: 'PUT',
      body: JSON.stringify({ meals: updatedDailyEntry }),
    }
    const result = await fetch(requestUrl, requestOptions)

    const resultJSON = await result.json()
    console.log('fired')
    console.log(resultJSON)
    return JSON.stringify(resultJSON.id)
  }
}
