import { DailyEntry, Meal } from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private dailyEntry: DailyEntry | null
  setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  private dataService: DataService

  public constructor(
    dailyEntry: DailyEntry | null,
    setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
  ) {
    this.dailyEntry = dailyEntry
    this.dataService = new DataService()
    this.setDailyEntry = setDailyEntry
  }

  public async fetchPageData(
    currentlySelectedDate: string,
    setPageLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setDailyEntry: React.Dispatch<React.SetStateAction<null | DailyEntry>>
  ) {
    if (currentlySelectedDate) {
      const data = await this.dataService.getDailyEntryByDate(
        currentlySelectedDate
      )
      setPageLoading(false)
      data.length > 0 ? setDailyEntry(data[0]) : setDailyEntry(null)
    }
  }

  public async deleteMeal(mealIndex: number, rows: Meal[]) {
    const newMeals =
      rows.filter((meal, index) => {
        return index !== mealIndex
      }) ?? []
    if (this.dailyEntry) {
      try {
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
        const result = await this.dataService.updateDailyEntryMeals(
          this.dailyEntry?.dailyEntryId,
          [...this.dailyEntry.meals, data]
        )
        // console.log(result)
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
        const result = await this.dataService.updateDailyEntryWeight(
          this.dailyEntry?.dailyEntryId,
          data.weight
        )
        console.log(result)
        this.setDailyEntry({ ...this.dailyEntry, weight: result })
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error updating weight: ${error.message}`)
        }
      }
    }
  }
}

//TODO   fix (data: any)
