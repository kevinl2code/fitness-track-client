import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import React, { useState } from 'react'
import { FitnessTrackFoodItem } from '../../model/Model'
import SearchIcon from '@mui/icons-material/Search'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

interface Props {
  isAdmin: boolean
  emptySubCategorySelected: boolean
  selectedSubCategory: string
  foodItems: FitnessTrackFoodItem[]
  foodItemsLoading: boolean
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setEditFoodDialogOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      foodItem: FitnessTrackFoodItem | null
    }>
  >
  setConfirmDeleteDialogOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      deleteItem: {
        name: string
        id: string
      } | null
    }>
  >
}

export const FoodsTable: React.FC<Props> = ({
  isAdmin,
  emptySubCategorySelected,
  selectedSubCategory,
  foodItems,
  foodItemsLoading,
  setAddFoodDialogOpen,
  setEditFoodDialogOpen,
  setConfirmDeleteDialogOpen,
}) => {
  const [filterText, setFilterText] = useState('')
  const { matchesMD } = useMediaQueries()
  // console.log(emptySubCategorySelected)
  const sortedFoodItems = foodItems.sort((a, b) => {
    const nameA = a.foodItemName.toUpperCase()
    const nameB = b.foodItemName.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })

  const filteredFoodItems = sortedFoodItems.filter((foodItem) => {
    return foodItem.foodItemName
      .toLowerCase()
      .includes(filterText.toLowerCase())
  })
  const generatedRows = filteredFoodItems.map((foodItem, index) => {
    const { foodItemId, calories, protein, carbohydrates, fat, foodItemName } =
      foodItem
    return (
      <TableRow
        key={`${foodItemId}-${index}`}
        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {foodItemName}
        </TableCell>
        <TableCell align="right">{calories}</TableCell>
        <TableCell align="right">{protein}</TableCell>
        <TableCell align="right">{fat}</TableCell>
        <TableCell align="right">{carbohydrates}</TableCell>
        {isAdmin && (
          <>
            <TableCell size="small" padding="none">
              <IconButton
                onClick={() => {
                  setEditFoodDialogOpen({
                    open: true,
                    foodItem: foodItem,
                  })
                }}
              >
                <EditIcon />
              </IconButton>
            </TableCell>
            <TableCell size="small" padding="none">
              <IconButton
                onClick={() => {
                  setConfirmDeleteDialogOpen({
                    open: true,
                    deleteItem: {
                      id: foodItemId,
                      name: foodItemName,
                    },
                  })
                }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </>
        )}
      </TableRow>
    )
  })

  const emptyTable = (
    <Table
      // sx={{ minWidth: 650 }}
      size="small"
      aria-label="empty-food-items-table"
    >
      <TableHead>
        <TableRow>
          <TableCell align="center">No Food Items Found</TableCell>
        </TableRow>
      </TableHead>
      <TableBody></TableBody>
    </Table>
  )

  return (
    <Grid item md={8} xs={12}>
      {selectedSubCategory.length > 0 && !foodItemsLoading && (
        <Paper
          elevation={0}
          variant={matchesMD ? 'outlined' : 'elevation'}
          sx={[
            !matchesMD && {
              margin: '0 8px 0 8px',
            },
          ]}
        >
          <Grid container>
            <Grid
              container
              item
              xs={12}
              justifyContent="space-between"
              alignItems="center"
              sx={{ backgroundColor: '#81d4fa' }}
            >
              <Grid item xs={5}>
                <Typography variant="h6" sx={{ paddingLeft: '1rem' }}>
                  Food Details
                </Typography>
              </Grid>
              <Grid container justifyContent="flex-end" item xs={7}>
                <TextField
                  variant="standard"
                  id="outlined-start-adornment"
                  sx={{ m: 1, width: '15ch' }}
                  onChange={(event) => setFilterText(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {isAdmin && (
                  <IconButton
                    color="primary"
                    aria-label="add consumable"
                    onClick={() => setAddFoodDialogOpen(true)}
                  >
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={0}>
                {emptySubCategorySelected ? (
                  emptyTable
                ) : (
                  <Table
                    // sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="food-items-table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Protein</TableCell>
                        <TableCell align="right">Fat</TableCell>
                        <TableCell align="right">Carbs</TableCell>
                        {isAdmin && (
                          <>
                            <TableCell align="right">{''}</TableCell>
                            <TableCell align="right">{''}</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>{generatedRows}</TableBody>
                  </Table>
                )}
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Grid>
  )
}
