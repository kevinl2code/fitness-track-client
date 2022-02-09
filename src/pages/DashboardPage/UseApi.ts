import { Cycle, DailyEntry, User } from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private user: User
  private userId: string
  private dataService: DataService
  private setEntries: React.Dispatch<React.SetStateAction<DailyEntry[] | null>>
  private setLoading: React.Dispatch<React.SetStateAction<boolean>>
  private setOpenNewUserDialog: React.Dispatch<React.SetStateAction<boolean>>
  private setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>

  public constructor(
    user: User,
    userId: string,
    setEntries: React.Dispatch<React.SetStateAction<DailyEntry[] | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenNewUserDialog: React.Dispatch<React.SetStateAction<boolean>>,
    setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
  ) {
    this.user = user
    this.userId = userId
    this.dataService = new DataService()
    this.setEntries = setEntries
    this.setLoading = setLoading
    this.setOpenNewUserDialog = setOpenNewUserDialog
    this.setCycleContext = setCycleContext
  }

  public async fetchPageData() {
    this.dataService.setUser(this.user)
    const cycleData = await this.dataService.getUserCycles(this.userId)
    const currentlyActiveCycle = cycleData?.find((cycle) => {
      return cycle.isActive === true
    })

    if (currentlyActiveCycle) {
      this.setCycleContext(currentlyActiveCycle)
    } else {
      this.setOpenNewUserDialog(true)
    }

    const entries = await this.dataService.getDailyEntriesForCycle(
      currentlyActiveCycle?.cycleId!
    )

    this.setLoading(false)

    if (entries.length > 0) {
      this.setEntries(entries)
    }
  }

  public async createNewUserCycle(newUserCycle: Cycle) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.createUserCycle(newUserCycle)
      this.setCycleContext(newUserCycle)
      this.setOpenNewUserDialog(false)
      console.log(result)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while creating entry: ${error.message}`)
      }
    }
  }
}
