import {
  FoodCategory,
  FitnessTrackFoodItem,
  User,
  FoodSubCategory,
} from '../../model/Model'
import { DataService } from '../../services/DataService'

export class UseApi {
  private user: User
  private dataService: DataService
  private setCategories: React.Dispatch<React.SetStateAction<FoodCategory[]>>
  private setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>
  private setSubCategories: React.Dispatch<
    React.SetStateAction<FoodSubCategory[]>
  >
  private setSubCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>
  private setFoodItems: React.Dispatch<
    React.SetStateAction<FitnessTrackFoodItem[]>
  >
  private setFoodItemsLoading: React.Dispatch<React.SetStateAction<boolean>>

  public constructor(
    user: User,
    setCategories: React.Dispatch<React.SetStateAction<FoodCategory[]>>,
    setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSubCategories: React.Dispatch<React.SetStateAction<FoodSubCategory[]>>,
    setSubCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFoodItems: React.Dispatch<React.SetStateAction<FitnessTrackFoodItem[]>>,
    setFoodItemsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.user = user
    this.dataService = new DataService()
    this.setCategories = setCategories
    this.setCategoriesLoading = setCategoriesLoading
    this.setSubCategories = setSubCategories
    this.setSubCategoriesLoading = setSubCategoriesLoading
    this.setFoodItems = setFoodItems
    this.setFoodItemsLoading = setFoodItemsLoading
  }

  public async fetchCategoryList() {
    this.dataService.setUser(this.user)
    const data: FoodCategory[] = await this.dataService.getFoodCategories()
    this.setCategories(data)
    this.setCategoriesLoading(false)
    // console.log(data)
  }

  public async fetchSubCategoryList(categoryId: string) {
    this.dataService.setUser(this.user)
    const data: FoodSubCategory[] = await this.dataService.getFoodSubCategories(
      categoryId
    )
    this.setSubCategories(data)
    this.setSubCategoriesLoading(false)
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
    this.setFoodItemsLoading(false)
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
  public async createFoodSubCategory(newFoodSubCategory: FoodSubCategory) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.createFoodSubCategory(
        newFoodSubCategory
      )
      console.log(result)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while creating food category: ${error.message}`)
      }
    }
  }

  public async updateFoodItem(updatedFoodItem: FitnessTrackFoodItem) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.updateFoodItem(updatedFoodItem)
      console.log(result)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while editing food item: ${error.message}`)
      }
    }
  }
}
