import { Box, Grid, SelectChangeEvent } from '@mui/material'

import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../app/App'
import { AddFoodCategoryDialog } from '../../components/dialogs/AddFoodCategoryDialog'
import { AddFoodItemDialog } from '../../components/dialogs/AddFoodItemDialog'
import { AddFoodSubCategoryDialog } from '../../components/dialogs/AddFoodSubCategoryDialog/AddFoodSubCategoryDialog'
import { EditFoodItemDialog } from '../../components/dialogs/EditFoodItemDialog'
import { FoodsCategorySelect } from '../../components/FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../../components/FoodsSubCategorySelect'
import { FoodsTable } from '../../components/FoodsTable'
import {
  FoodCategory,
  FitnessTrackFoodItem,
  FoodSubCategory,
} from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { UseApi } from './UseApi'
// import meatImage from '../../../public/meat.jpg'
// import { MyFoodsTile } from '../../components/MyFoodsTile'

//https://www.ars.usda.gov/ARSUserFiles/80400530/pdf/1112/food_category_list.pdf

export const FoodsPage: React.FC = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [foodItemsLoading, setFoodItemsLoading] = useState(true)
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  const [editFoodDialogOpen, setEditFoodDialogOpen] = useState<{
    open: boolean
    foodItem: FitnessTrackFoodItem | null
  }>({
    open: false,
    foodItem: null,
  })
  const [addFoodCategoryDialogOpen, setAddFoodCategoryDialogOpen] =
    useState(false)
  const [addFoodSubCategoryDialogOpen, setAddFoodSubCategoryDialogOpen] =
    useState(false)
  const user = useContext(UserContext)
  const isAdmin = user?.user.isAdmin!
  const useApi = new UseApi(
    user?.user!,
    setCategories,
    setCategoriesLoading,
    setSubCategories,
    setSubCategoriesLoading,
    setFoodItems,
    setFoodItemsLoading
  )
  const { matchesMD } = useMediaQueries()

  useEffect(() => {
    useApi.fetchCategoryList()
  }, [])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory('')
    setFoodItems([])
    setSelectedCategory(event.target.value)
    useApi.fetchSubCategoryList(event.target.value)
  }
  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value)
    useApi.fetchFoodItems(selectedCategory, event.target.value)
  }

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  return (
    <>
      <AddFoodItemDialog
        open={addFoodDialogOpen}
        categoryId={selectedCategory}
        subCategoryId={selectedSubCategory}
        useApi={useApi}
        setAddFoodDialogOpen={setAddFoodDialogOpen}
      />
      <AddFoodCategoryDialog
        open={addFoodCategoryDialogOpen}
        setCategoriesLoading={setCategoriesLoading}
        setAddFoodCategoryDialogOpen={setAddFoodCategoryDialogOpen}
        useApi={useApi}
      />
      <AddFoodSubCategoryDialog
        open={addFoodSubCategoryDialogOpen}
        setAddFoodSubCategoryDialogOpen={setAddFoodSubCategoryDialogOpen}
        categoryId={selectedCategory}
        setSubCategoriesLoading={setSubCategoriesLoading}
        useApi={useApi}
      />
      <EditFoodItemDialog
        open={editFoodDialogOpen.open}
        foodItem={editFoodDialogOpen.foodItem}
        setEditFoodDialogOpen={setEditFoodDialogOpen}
        useApi={useApi}
      />
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={matchesMD ? 1 : 0} sx={{ width: '100%' }}>
          <FoodsCategorySelect
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategory={selectedCategory}
            setAddFoodCategoryDialogOpen={setAddFoodCategoryDialogOpen}
            isAdmin={isAdmin}
            handleCategoryChange={handleCategoryChange}
          />
          <FoodsSubCategorySelect
            subCategories={subCategories}
            subCategoriesLoading={subCategoriesLoading}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            setAddFoodSubCategoryDialogOpen={setAddFoodSubCategoryDialogOpen}
            handleSubCategoryChange={handleSubCategoryChange}
            isAdmin={isAdmin}
          />
          <FoodsTable
            foodItems={foodItems}
            foodItemsLoading={foodItemsLoading}
            emptySubCategorySelected={emptySubCategorySelected}
            selectedSubCategory={selectedSubCategory}
            isAdmin={isAdmin}
            setAddFoodDialogOpen={setAddFoodDialogOpen}
            setEditFoodDialogOpen={setEditFoodDialogOpen}
          />
          {/* {emptySubCategorySelected && <h3>NOT FOUND</h3>} */}
        </Grid>
      </Box>
    </>
  )
}
