import { DailyEntry, EntryMeal, User } from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private dailyEntry: DailyEntry | null
  setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  private dataService: DataService
  private user: User
  private cycleId: string
  private currentlySelectedDate: string | undefined

  public constructor(
    user: User,
    cycleId: string,
    currentlySelectedDate: string | undefined,
    dailyEntry: DailyEntry | null,
    setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  ) {
    this.dailyEntry = dailyEntry
    this.dataService = new DataService()
    this.user = user
    this.cycleId = cycleId
    this.currentlySelectedDate = currentlySelectedDate
    this.setDailyEntry = setDailyEntry
  }

  public async fetchPageData(
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setDailyEntry: React.Dispatch<React.SetStateAction<null | DailyEntry>>
  ) {
    if (this.currentlySelectedDate) {
      this.dataService.setUser(this.user)
      const data = await this.dataService.getDailyEntryByDate(
        this.cycleId,
        this.currentlySelectedDate
      )
      setPageLoading(false)
      data.length > 0 ? setDailyEntry(data[0]) : setDailyEntry(null)
    }
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

  public async deleteMeal(mealIndex: number, rows: EntryMeal[]) {
    const newMeals =
      rows.filter((meal, index) => {
        return index !== mealIndex
      }) ?? []
    if (this.dailyEntry) {
      try {
        if (this.currentlySelectedDate) {
          this.dataService.setUser(this.user)
          const result = await this.dataService.updateDailyEntryMeals(
            this.cycleId,
            this.currentlySelectedDate,
            newMeals
          )
          this.setDailyEntry({ ...this.dailyEntry, dailyEntryMeals: result })
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error deleting meals: ${error.message}`)
        }
      }
    }
  }

  public async addMeal(data: any) {
    if (this.dailyEntry) {
      try {
        if (this.currentlySelectedDate) {
          this.dataService.setUser(this.user)
          const result = await this.dataService.updateDailyEntryMeals(
            this.cycleId,
            this.currentlySelectedDate,
            [...this.dailyEntry.dailyEntryMeals, data]
          )
          console.log(result)
          this.setDailyEntry({ ...this.dailyEntry, dailyEntryMeals: result })
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error adding meal: ${error.message}`)
        }
      }
    }
  }

  public async updateWeight(data: any) {
    if (this.dailyEntry) {
      try {
        if (this.currentlySelectedDate) {
          this.dataService.setUser(this.user)
          const result = await this.dataService.updateDailyEntryWeight(
            this.cycleId,
            this.currentlySelectedDate,
            data
          )
          this.setDailyEntry({ ...this.dailyEntry, dailyEntryWeight: result })
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error updating weight: ${error.message}`)
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
            this.cycleId,
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
