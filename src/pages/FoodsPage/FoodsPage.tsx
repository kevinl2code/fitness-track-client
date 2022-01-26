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
import { FoodsTable } from '../../components/FoodsTable'
import {
  Category,
  FitnessTrackFoodItem,
  SubCategoryListItem,
} from '../../model/Model'
import { UseApi } from './UseApi'
// import meatImage from '../../../public/meat.jpg'
// import { MyFoodsTile } from '../../components/MyFoodsTile'

//https://www.ars.usda.gov/ARSUserFiles/80400530/pdf/1112/food_category_list.pdf

export const FoodsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const user = useContext(UserContext)
  const useApi = new UseApi(user?.user!, setCategories, setFoodItems)

  const subCategories = useMemo(() => {
    const subCategoriesValues: {
      [key: string]: SubCategoryListItem[]
    } = {}
    categories.forEach((category) => {
      subCategoriesValues[category.categoryId] = category.subCategories
    })
    return subCategoriesValues
  }, [categories])

  useEffect(() => {
    useApi.fetchCategoryList()
  }, [])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory('')
    setFoodItems([])
    setSelectedCategory(event.target.value)
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
  const generatedSubCategories = subCategories[selectedCategory]?.map(
    (subCategory, index) => {
      const name = subCategory.name
      const value = subCategory.subCategoryId
      return (
        <MenuItem value={value} key={`${index}-${value}`}>
          {name}
        </MenuItem>
      )
    }
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1} sx={{ width: '100%' }}>
        <Grid item md={2} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-autowidth-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
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
        <Grid item md={2} xs={12}>
          {selectedCategory.length > 1 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-autowidth-label">
                Sub-Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
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
          {foodItems.length > 1 && <FoodsTable foodItems={foodItems} />}
        </Grid>
      </Grid>
    </Box>
  )
}
