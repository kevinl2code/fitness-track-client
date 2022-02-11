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
    setSubCategories: React.Dispatch<React.SetStateAction<FoodSubCategory[]>>,
    setSubCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFoodItems: React.Dispatch<React.SetStateAction<FitnessTrackFoodItem[]>>,
    setFoodItemsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    this.user = user
    this.dataService = new DataService()
    this.setSubCategories = setSubCategories
    this.setSubCategoriesLoading = setSubCategoriesLoading
    this.setFoodItems = setFoodItems
    this.setFoodItemsLoading = setFoodItemsLoading
  }

  public async fetchSubCategoryList(categoryId: string) {
    this.dataService.setUser(this.user)
    const data: FoodSubCategory[] = await this.dataService.getFoodSubCategories(
      categoryId
    )
    this.setSubCategories(data)
    this.setSubCategoriesLoading(false)
  }

  public async fetchFoodItems(categoryId: string, subCategoryId: string) {
    this.dataService.setUser(this.user)
    const data = await this.dataService.getFoodItems(categoryId, subCategoryId)
    this.setFoodItems(data)
    this.setFoodItemsLoading(false)
  }

  public async createFoodItem(foodItem: FitnessTrackFoodItem) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.createFoodItem(foodItem)
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
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while editing food item: ${error.message}`)
      }
    }
  }

  public async deleteFoodItem(foodItemId: string) {
    try {
      this.dataService.setUser(this.user)
      const result = await this.dataService.deleteFoodItem(foodItemId)
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error while editing food item: ${error.message}`)
      }
    }
  }
}
