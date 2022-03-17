import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material'
import React from 'react'
import { FieldValues, UseFormReset } from 'react-hook-form'
import { FitnessTrackFoodItem } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { FormattedTextField } from '../FormattedTextField/FormattedTextField'

interface Props {
  emptySubCategorySelected: boolean
  selectedSubCategory: string
  foodItems: FitnessTrackFoodItem[]
  foodItemsLoading: boolean
  selectedFoodItem: FitnessTrackFoodItem | null
  filterText: string
  helperText?: string
  reset: UseFormReset<FieldValues>
  setFilterText: React.Dispatch<React.SetStateAction<string>>
  setSelectedFoodItem: React.Dispatch<
    React.SetStateAction<FitnessTrackFoodItem | null>
  >
  setQuantity: (value: React.SetStateAction<string>) => void
}

export const ConsumablesList: React.FC<Props> = ({
  emptySubCategorySelected,
  selectedSubCategory,
  foodItems,
  foodItemsLoading,
  selectedFoodItem,
  filterText,
  helperText,
  reset,
  setFilterText,
  setSelectedFoodItem,
  setQuantity,
}) => {
  const { matchesMD } = useMediaQueries()
  const filteredListItems = foodItems.filter((foodItem) => {
    return foodItem.foodItemName
      .toLowerCase()
      .includes(filterText.toLowerCase())
  })
  const generatedList = filteredListItems.map((foodItem, index) => {
    const { foodItemName } = foodItem
    return (
      <ListItem key={`${index}-${foodItemName}`} disableGutters>
        <ListItemButton onClick={() => setSelectedFoodItem(foodItem)}>
          <ListItemText primary={foodItemName} />
        </ListItemButton>
      </ListItem>
    )
  })

  return (
    <Grid
      item
      md={8}
      xs={12}
      sx={{
        marginBottom: '1rem',
      }}
    >
      {selectedSubCategory.length > 0 && !foodItemsLoading && (
        <Paper elevation={0} variant={matchesMD ? 'outlined' : 'elevation'}>
          <Grid container>
            {selectedFoodItem ? (
              <FormattedTextField
                label="Consumable"
                value={selectedFoodItem.foodItemName}
                helperText={helperText}
                onChange={(event) => setFilterText(event.target.value)}
                inputProps={{
                  position: 'end',
                  child: (
                    <IconButton
                      aria-label="remove-selected-consumable"
                      onClick={() => {
                        setFilterText('')
                        reset()
                        setQuantity('')
                        setSelectedFoodItem(null)
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />
            ) : (
              <>
                <FormattedTextField
                  label="Consumable"
                  value={filterText}
                  onChange={(event) => setFilterText(event.target.value)}
                  inputProps={{
                    position: 'start',
                    child: <SearchIcon />,
                  }}
                />
                <Grid item xs={12}>
                  <List>{generatedList}</List>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      )}
    </Grid>
  )
}
