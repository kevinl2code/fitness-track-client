import { DailyEntry, EntryConsumable, User } from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private dailyEntry: DailyEntry | null
  setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  private dataService: DataService
  private user: User
  private userId: string
  private cycleId: string
  private currentlySelectedDate: string | undefined

  public constructor(
    user: User,
    userId: string,
    cycleId: string,
    currentlySelectedDate: string | undefined,
    dailyEntry: DailyEntry | null,
    setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  ) {
    this.dailyEntry = dailyEntry
    this.dataService = new DataService()
    this.user = user
    this.userId = userId
    this.cycleId = cycleId
    this.currentlySelectedDate = currentlySelectedDate
    this.setDailyEntry = setDailyEntry
  }

  public async createNewDailyEntry(newDailyEntry: any) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.createDailyEntry(newDailyEntry)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while creating entry: ${error.message}`)
      }
    }
  }

  public async deleteConsumable(
    consumableIndex: number,
    rows: EntryConsumable[]
  ) {
    const newConsumables =
      rows.filter((consumable, index) => {
        return index !== consumableIndex
      }) ?? []
    if (this.dailyEntry) {
      try {
        if (this.currentlySelectedDate) {
          this.dataService.setUser(this.user)
          const result = await this.dataService.updateDailyEntryConsumables(
            this.userId,
            this.currentlySelectedDate,
            newConsumables
          )
          this.setDailyEntry({
            ...this.dailyEntry,
            dailyEntryConsumables: result,
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error deleting consumables: ${error.message}`)
        }
      }
    }
  }

  public async addConsumable(data: any) {
    if (this.dailyEntry) {
      try {
        if (this.currentlySelectedDate) {
          this.dataService.setUser(this.user)
          const result = await this.dataService.updateDailyEntryConsumables(
            this.userId,
            this.currentlySelectedDate,
            [...this.dailyEntry.dailyEntryConsumables, data]
          )
          // console.log(result)
          this.setDailyEntry({
            ...this.dailyEntry,
            dailyEntryConsumables: result,
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error adding consumable: ${error.message}`)
        }
      }
    }
  }

  public async updateActivityLevel(data: any) {
    if (this.dailyEntry) {
      try {
        if (this.currentlySelectedDate) {
          this.dataService.setUser(this.user)
          const result = await this.dataService.updateDailyEntryActivityLevel(
            this.userId,
            this.currentlySelectedDate,
            data
          )
          this.setDailyEntry({
            ...this.dailyEntry,
            dailyEntryActivityLevel: result,
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error updating activity level: ${error.message}`)
        }
      }
    }
  }
}

//TODO   fix (data: any)
