import {
  Grid,
  InputAdornment,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../app/App'
import {
  FitnessTrackFoodItem,
  FoodCategory,
  FoodSubCategory,
} from '../../../model/Model'
import { UseApi } from '../../../pages/FoodsPage/UseApi'
import { ConsumablesList } from '../../ConsumablesList'
import { FoodsCategorySelect } from '../../FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../../FoodsSubCategorySelect'

export const AddFoodCatalogConsumableForm: React.FC = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [foodItemsLoading, setFoodItemsLoading] = useState(true)
  const [filterText, setFilterText] = useState('')
  const [selectedFoodItem, setSelectedFoodItem] =
    useState<FitnessTrackFoodItem | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const user = useContext(UserContext)
  const useApi = new UseApi(
    user?.user!,
    setCategories,
    setCategoriesLoading,
    setSubCategories,
    setSubCategoriesLoading,
    setFoodItems,
    setFoodItemsLoading
  )

  useEffect(() => {
    useApi.fetchCategoryList()
  }, [])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory('')
    setFoodItems([])
    setFilterText('')
    setSelectedCategory(event.target.value)
    useApi.fetchSubCategoryList(event.target.value)
  }
  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value)
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    useApi.fetchFoodItems(selectedCategory, event.target.value)
  }

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  return (
    <Grid container justifyContent="center">
      <FoodsCategorySelect
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        setAddFoodCategoryDialogOpen={() => null}
        isAdmin={false}
        handleCategoryChange={handleCategoryChange}
      />
      <FoodsSubCategorySelect
        subCategories={subCategories}
        subCategoriesLoading={subCategoriesLoading}
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        setAddFoodSubCategoryDialogOpen={() => null}
        handleSubCategoryChange={handleSubCategoryChange}
        isAdmin={false}
      />
      <ConsumablesList
        foodItems={foodItems}
        foodItemsLoading={foodItemsLoading}
        emptySubCategorySelected={emptySubCategorySelected}
        selectedSubCategory={selectedSubCategory}
        selectedFoodItem={selectedFoodItem}
        filterText={filterText}
        setFilterText={setFilterText}
        setSelectedFoodItem={setSelectedFoodItem}
      />
      <Grid
        container
        item
        xs={12}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid container justifyContent="flex-end" item>
          <TextField
            variant="standard"
            id="outlined-start-adornment"
            sx={{ width: '100%' }}
            label="Quantity"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {selectedFoodItem?.foodItemUnit.toLowerCase()}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
