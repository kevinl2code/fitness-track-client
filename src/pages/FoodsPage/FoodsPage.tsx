import { Box, Grid, SelectChangeEvent } from '@mui/material'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../app/App'
import { AddFoodCategoryDialog } from '../../components/dialogs/AddFoodCategoryDialog'
import { AddFoodItemDialog } from '../../components/dialogs/AddFoodItemDialog'
import { AddFoodSubCategoryDialog } from '../../components/dialogs/AddFoodSubCategoryDialog/AddFoodSubCategoryDialog'
import { ConfirmDeleteDialog } from '../../components/dialogs/ConfirmDeleteDialog'
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
import { useMutation, useQuery } from 'react-query'
import { DataService } from '../../services/DataService'

//https://www.ars.usda.gov/ARSUserFiles/80400530/pdf/1112/food_category_list.pdf

export const FoodsPage: React.FC = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  const [editFoodDialogOpen, setEditFoodDialogOpen] = useState<{
    open: boolean
    foodItem: FitnessTrackFoodItem | null
  }>({
    open: false,
    foodItem: null,
  })
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState<{
    open: boolean
    deleteItem: {
      name: string
      id: string
    } | null
  }>({
    open: false,
    deleteItem: null,
  })
  const [addFoodCategoryDialogOpen, setAddFoodCategoryDialogOpen] =
    useState(false)
  const [addFoodSubCategoryDialogOpen, setAddFoodSubCategoryDialogOpen] =
    useState(false)
  const user = useContext(UserContext)
  const isAdmin = user?.user.isAdmin!
  const { matchesMD } = useMediaQueries()

  const dataService = new DataService()

  dataService.setUser(user?.user!)

  const { isLoading: categoriesLoading, data: fetchedCategories } = useQuery(
    'categoryList',
    () => dataService.getFoodCategories(),
    {
      onSuccess: (data) => setCategories(data),
    }
  )

  const {
    isLoading: subCategoriesLoading,
    data: fetchedSubCategories,
    refetch: fetchSubCategoryList,
  } = useQuery(
    ['foodsSubCategoryList', selectedCategory],
    () => dataService.getFoodSubCategories(selectedCategory),
    {
      enabled: !!selectedCategory,
      onSuccess: (data) => setSubCategories(data),
    }
  )

  const { isLoading: foodItemsLoading, refetch: fetchFoodItems } = useQuery(
    ['foodsFoodItems', selectedCategory, selectedSubCategory],
    () => dataService.getFoodItems(selectedCategory, selectedSubCategory),
    {
      enabled: !!selectedSubCategory,
      onSuccess: (data) => {
        setFoodItems(data)
      },
    }
  )

  const { mutate: deleteFoodItem, isLoading } = useMutation(
    (foodItemId: string) => dataService.deleteFoodItem(foodItemId),
    {
      onSuccess: () => {
        fetchFoodItems()
        setConfirmDeleteDialogOpen({
          open: false,
          deleteItem: null,
        })
      },
    }
  )

  const useHandleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory('')
    setFoodItems([])
    setSelectedCategory(event.target.value)
    setSubCategories(fetchedSubCategories)
  }

  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value)
  }

  const handleDelete = async () => {
    deleteFoodItem(confirmDeleteDialogOpen.deleteItem?.id!)
    fetchFoodItems()
  }

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  return (
    <>
      <ConfirmDeleteDialog
        open={confirmDeleteDialogOpen.open}
        deleteItem={confirmDeleteDialogOpen.deleteItem}
        handleDelete={handleDelete}
        setConfirmDeleteDialogOpen={setConfirmDeleteDialogOpen}
      />
      <AddFoodItemDialog
        open={addFoodDialogOpen}
        categoryId={selectedCategory}
        subCategoryId={selectedSubCategory}
        dataService={dataService}
        fetchFoodItems={fetchFoodItems}
        setAddFoodDialogOpen={setAddFoodDialogOpen}
      />
      <AddFoodCategoryDialog
        open={addFoodCategoryDialogOpen}
        setAddFoodCategoryDialogOpen={setAddFoodCategoryDialogOpen}
        dataService={dataService}
      />
      <AddFoodSubCategoryDialog
        open={addFoodSubCategoryDialogOpen}
        dataService={dataService}
        fetchSubCategoryList={fetchSubCategoryList}
        setAddFoodSubCategoryDialogOpen={setAddFoodSubCategoryDialogOpen}
        categoryId={selectedCategory}
      />
      <EditFoodItemDialog
        open={editFoodDialogOpen.open}
        dataService={dataService}
        foodItem={editFoodDialogOpen.foodItem}
        setEditFoodDialogOpen={setEditFoodDialogOpen}
        fetchFoodItems={fetchFoodItems}
      />
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={matchesMD ? 1 : 0} sx={{ width: '100%' }}>
          <FoodsCategorySelect
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategory={selectedCategory}
            setAddFoodCategoryDialogOpen={setAddFoodCategoryDialogOpen}
            isAdmin={isAdmin}
            handleCategoryChange={useHandleCategoryChange}
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
            setConfirmDeleteDialogOpen={setConfirmDeleteDialogOpen}
          />
        </Grid>
      </Box>
    </>
  )
}
