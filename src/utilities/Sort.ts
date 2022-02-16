import { Cycle, DailyEntry } from '../model/Model'

export class Sort {
  public dailyEntriesByDate(arr: DailyEntry[]) {
    return arr.sort((a, b) => {
      const parsedDateA = parseInt(a.entryDate)
      const parsedDateB = parseInt(b.entryDate)

      return parsedDateA - parsedDateB
    })
  }
  public cyclesByDate(arr: Cycle[]) {
    return arr.sort((a, b) => {
      const parsedDateA = parseInt(a.startDate)
      const parsedDateB = parseInt(b.startDate)

      return parsedDateA - parsedDateB
    })
  }
}
