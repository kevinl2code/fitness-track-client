import {
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItemText,
  ListItem,
  ListItemButton,
  Divider,
  IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import React, { useState } from 'react'
import { FitnessTrackFoodItem } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  emptySubCategorySelected: boolean
  selectedSubCategory: string
  foodItems: FitnessTrackFoodItem[]
  foodItemsLoading: boolean
  selectedFoodItem: FitnessTrackFoodItem | null
  filterText: string
  setFilterText: React.Dispatch<React.SetStateAction<string>>
  setSelectedFoodItem: React.Dispatch<
    React.SetStateAction<FitnessTrackFoodItem | null>
  >
}

export const ConsumablesList: React.FC<Props> = ({
  emptySubCategorySelected,
  selectedSubCategory,
  foodItems,
  foodItemsLoading,
  selectedFoodItem,
  filterText,
  setFilterText,
  setSelectedFoodItem,
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
    <Grid item md={8} xs={12}>
      {selectedSubCategory.length > 0 && !foodItemsLoading && (
        <Paper elevation={0} variant={matchesMD ? 'outlined' : 'elevation'}>
          <Grid container>
            {selectedFoodItem ? (
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
                    label="Consumable"
                    value={selectedFoodItem.foodItemName}
                    onChange={(event) => setFilterText(event.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setFilterText('')
                              setSelectedFoodItem(null)
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <>
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="space-between"
                  alignItems="center"
                  // sx={{ backgroundColor: '#81d4fa' }}
                >
                  <Grid container justifyContent="flex-end" item>
                    <TextField
                      variant="standard"
                      id="outlined-start-adornment"
                      sx={{ width: '100%' }}
                      label="Consumable"
                      value={filterText}
                      onChange={(event) => setFilterText(event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
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
