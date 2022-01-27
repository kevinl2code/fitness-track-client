import { FoodCategory, FitnessTrackFoodItem, User } from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private user: User
  private dataService: DataService
  // private setLoading: React.Dispatch<React.SetStateAction<boolean>>
  private setCategories: React.Dispatch<React.SetStateAction<FoodCategory[]>>
  private setFoodItems: React.Dispatch<
    React.SetStateAction<FitnessTrackFoodItem[]>
  >

  public constructor(
    user: User,
    setCategories: React.Dispatch<React.SetStateAction<FoodCategory[]>>,
    setFoodItems: React.Dispatch<React.SetStateAction<FitnessTrackFoodItem[]>>
    // setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.user = user
    this.dataService = new DataService()
    this.setCategories = setCategories
    this.setFoodItems = setFoodItems
    // this.setLoading = setLoading
  }

  public async fetchCategoryList() {
    this.dataService.setUser(this.user)
    const data: FoodCategory[] = await this.dataService.getFoodCategories()
    this.setCategories(data)
    // console.log(data)
  }

  public async fetchFoodItems(categoryId: string, subCategoryId: string) {
    this.dataService.setUser(this.user)
    console.log({
      catId: categoryId,
      subCatId: subCategoryId,
    })
    const data = await this.dataService.getFoodItems(categoryId, subCategoryId)
    this.setFoodItems(data)
  }

  public async createFoodItem(foodItem: FitnessTrackFoodItem) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.createFoodItem(foodItem)
      console.log(result)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while creating food item: ${error.message}`)
      }
    }
  }
  public async createFoodCategory(newFoodCategory: FoodCategory) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.createFoodCategory(newFoodCategory)
      console.log(result)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while creating food category: ${error.message}`)
      }
    }
  }
}
