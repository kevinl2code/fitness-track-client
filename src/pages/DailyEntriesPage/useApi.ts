import { ICreateDailyEntry } from '../../components/DailyEntryCreateNew/DailyEntryCreateNew'
import { DailyEntry, EntryMeal, User } from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private dailyEntry: DailyEntry | null
  setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  private dataService: DataService
  private user: User

  public constructor(
    user: User,
    dailyEntry: DailyEntry | null,
    setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  ) {
    this.dailyEntry = dailyEntry
    this.dataService = new DataService()
    this.user = user
    this.setDailyEntry = setDailyEntry
  }

  public async fetchPageData(
    currentlySelectedDate: string,
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setDailyEntry: React.Dispatch<React.SetStateAction<null | DailyEntry>>
  ) {
    if (currentlySelectedDate) {
      this.dataService.setUser(this.user)
      const data = await this.dataService.getDailyEntryByDate(
        currentlySelectedDate
      )
      setPageLoading(false)
      data.length > 0 ? setDailyEntry(data[0]) : setDailyEntry(null)
    }
  }

  public async createNewDailyEntry(newDailyEntry: ICreateDailyEntry) {
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
        this.dataService.setUser(this.user)
        const result = await this.dataService.updateDailyEntryMeals(
          this.dailyEntry?.dailyEntryId,
          newMeals
        )
        this.setDailyEntry({ ...this.dailyEntry, meals: result })
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
        this.dataService.setUser(this.user)
        const result = await this.dataService.updateDailyEntryMeals(
          this.dailyEntry?.dailyEntryId,
          [...this.dailyEntry.meals, data]
        )
        this.setDailyEntry({ ...this.dailyEntry, meals: result })
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
        this.dataService.setUser(this.user)
        const result = await this.dataService.updateDailyEntryWeight(
          this.dailyEntry?.dailyEntryId,
          data.weight
        )
        this.setDailyEntry({ ...this.dailyEntry, weight: result })
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
        this.dataService.setUser(this.user)
        const result = await this.dataService.updateDailyEntryActivityLevel(
          this.dailyEntry.dailyEntryId,
          data.activityLevel
        )
        this.setDailyEntry({ ...this.dailyEntry, activityLevel: result })
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error updating activity level: ${error.message}`)
        }
      }
    }
  }
}

//TODO   fix (data: any)
