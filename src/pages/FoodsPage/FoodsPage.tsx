import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../../app/App'
import { AddFoodItemDialog } from '../../components/dialogs/AddFoodItemDialog'
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
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  const user = useContext(UserContext)
  const useApi = new UseApi(
    user?.user!,
    setCategories,
    setSubCategories,
    setFoodItems
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

  const generatedCategories = categories.map((category, index) => {
    const name = category.name
    const value = category.categoryId
    return (
      <MenuItem value={value} key={`${index}-${value}`}>
        {name}
      </MenuItem>
    )
  })
  const generatedSubCategories = subCategories?.map((subCategory, index) => {
    const name = subCategory.name
    const value = subCategory.subCategoryId
    return (
      <MenuItem value={value} key={`${index}-${value}`}>
        {name}
      </MenuItem>
    )
  })

  return (
    <>
      <AddFoodItemDialog
        open={addFoodDialogOpen}
        user={user!}
        categoryId={selectedCategory}
        subCategoryId={selectedSubCategory}
        useApi={useApi}
        setAddFoodDialogOpen={setAddFoodDialogOpen}
      />
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={matchesMD ? 1 : 0} sx={{ width: '100%' }}>
          <Grid
            item
            md={2}
            xs={12}
            sx={[
              !matchesMD && {
                marginTop: '2rem',
                marginBottom: '1rem',
              },
            ]}
          >
            <FormControl fullWidth variant="standard">
              <InputLabel id="category">Category</InputLabel>
              <Select
                labelId="category"
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {generatedCategories}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            md={2}
            xs={12}
            sx={[
              !matchesMD && {
                marginBottom: '1rem',
              },
            ]}
          >
            {selectedCategory.length > 1 && (
              <FormControl fullWidth variant="standard">
                <InputLabel id="subCategory">Sub-Category</InputLabel>
                <Select
                  labelId="subCategory"
                  id="subCategory"
                  value={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  label="Sub-Category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {generatedSubCategories}
                </Select>
              </FormControl>
            )}
          </Grid>
          <Grid item md={8} xs={12}>
            {foodItems.length > 0 && (
              <FoodsTable
                foodItems={foodItems}
                isAdmin={user?.user.isAdmin!}
                setAddFoodDialogOpen={setAddFoodDialogOpen}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
