import { config } from 'aws-sdk'
import { DailyEntry } from '../model/Model'

config.update({
  region: process.env.REACT_APP_REGION,
})

export class DataService {
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
    console.log(requestUrl)
    const requestResult = await fetch(requestUrl, {
      method: 'GET',
      // headers: {
      //     'Authorization': this.getUserIdToken()
      // }
    })
    const responseJSON = await requestResult.json()
    return responseJSON
  }
}
