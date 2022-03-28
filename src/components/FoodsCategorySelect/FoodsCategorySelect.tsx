import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from '@mui/material'
import React from 'react'
import { FoodCategory } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  categories: FoodCategory[]
  categoriesLoading: boolean
  selectedCategory: string
  isAdmin: boolean
  handleCategoryChange: (event: SelectChangeEvent) => void
  setAddFoodCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FoodsCategorySelect: React.FC<Props> = ({
  categories,
  categoriesLoading,
  selectedCategory,
  isAdmin,
  handleCategoryChange,
  setAddFoodCategoryDialogOpen,
}) => {
  const generatedCategories = categories?.map((category, index) => {
    const name = category.name
    const value = category.categoryId
    return (
      <MenuItem value={value} key={`${index}-${value}`}>
        {name}
      </MenuItem>
    )
  })
  return (
    <Grid
      item
      md={2}
      xs={12}
      sx={{
        margin: '2rem 0px 1rem 0px',
      }}
    >
      <FormControl fullWidth variant="standard">
        <InputLabel id="category">Category</InputLabel>
        <Select
          labelId="category"
          disabled={categoriesLoading}
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
      {isAdmin && (
        <Button
          fullWidth
          color="error"
          variant="text"
          onClick={() => setAddFoodCategoryDialogOpen(true)}
        >
          Add Category
        </Button>
      )}
    </Grid>
  )
}
