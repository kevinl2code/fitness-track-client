import { SelectChangeEvent, Box, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { UserContext } from '../../app/App'
import {
  FoodCategory,
  FoodSubCategory,
  FitnessTrackFoodItem,
} from '../../model/Model'
import { DataService } from '../../services/DataService'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { AddFoodCategoryDialog } from '../dialogs/AddFoodCategoryDialog'
import { AddFoodItemDialog } from '../dialogs/AddFoodItemDialog'
import { AddFoodSubCategoryDialog } from '../dialogs/AddFoodSubCategoryDialog'
import { ConfirmationDialog } from '../dialogs/ConfirmationDialog'
import { FoodsCategorySelect } from '../FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../FoodsSubCategorySelect'
import { FoodsTable } from '../FoodsTable'

export const FoodsCatalogView: React.FC = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<{
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
        setConfirmationDialogOpen({
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
    deleteFoodItem(confirmationDialogOpen.deleteItem?.id!)
    fetchFoodItems()
  }

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  return (
    <>
      <ConfirmationDialog
        open={confirmationDialogOpen.open}
        deleteItem={confirmationDialogOpen.deleteItem}
        handleConfirmation={handleDelete}
        setConfirmDeleteDialogOpen={setConfirmationDialogOpen}
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
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={0} sx={{ width: '100%' }}>
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
          {selectedSubCategory.length > 0 && !foodItemsLoading && (
            <FoodsTable
              foodItems={foodItems}
              isAdmin={isAdmin}
              setAddFoodDialogOpen={setAddFoodDialogOpen}
              setConfirmDeleteDialogOpen={setConfirmationDialogOpen}
            />
          )}
        </Grid>
      </Box>
    </>
  )
}
