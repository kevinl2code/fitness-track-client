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
import { FoodSubCategory } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  selectedCategory: string
  subCategoriesLoading: boolean
  selectedSubCategory: string
  subCategories: FoodSubCategory[]
  isAdmin: boolean
  handleSubCategoryChange: (event: SelectChangeEvent) => void
  setAddFoodSubCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FoodsSubCategorySelect: React.FC<Props> = ({
  selectedCategory,
  subCategoriesLoading,
  selectedSubCategory,
  subCategories,
  isAdmin,
  handleSubCategoryChange,
  setAddFoodSubCategoryDialogOpen,
}) => {
  const { matchesMD } = useMediaQueries()
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
    <Grid
      item
      md={2}
      xs={12}
      sx={[
        !matchesMD && {
          margin: '0 0px 1rem 0px',
        },
      ]}
    >
      {selectedCategory.length > 1 && (
        <FormControl fullWidth variant="standard">
          <InputLabel id="subCategory">Sub-Category</InputLabel>
          <Select
            labelId="subCategory"
            id="subCategory"
            disabled={subCategoriesLoading}
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
      {selectedCategory.length > 1 && isAdmin && (
        <Button
          fullWidth
          color="error"
          variant="text"
          onClick={() => setAddFoodSubCategoryDialogOpen(true)}
        >
          Add Sub-Category
        </Button>
      )}
    </Grid>
  )
}
