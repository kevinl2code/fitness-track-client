import { DailyEntry } from '../model/Model'

export class Sort {
  public dailyEntriesByDate(arr: DailyEntry[]) {
    return arr.sort((a, b) => {
      const parsedDateA = Date.parse(a.entryDate)
      const parsedDateB = Date.parse(b.entryDate)
      return parsedDateA - parsedDateB
    })
  }
}
