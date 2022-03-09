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
  Box,
  Collapse,
} from '@mui/material'
import React, { useState } from 'react'
import { FitnessTrackFoodItem, UserFoodItem } from '../../model/Model'
import SearchIcon from '@mui/icons-material/Search'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface Props {
  isAdmin: boolean
  foodItems: FitnessTrackFoodItem[] | UserFoodItem[]
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
interface RowProps {
  foodItem: FitnessTrackFoodItem | UserFoodItem
}

export const FoodsTableNew: React.FC<Props> = ({
  isAdmin,
  foodItems,
  setAddFoodDialogOpen,
  setEditFoodDialogOpen,
  setConfirmDeleteDialogOpen,
}) => {
  const [filterText, setFilterText] = useState('')
  const { matchesMD } = useMediaQueries()
  const sortedFoodItems: FitnessTrackFoodItem[] | UserFoodItem[] =
    foodItems.sort((a, b) => {
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

  const filteredFoodItems: FitnessTrackFoodItem[] | UserFoodItem[] =
    sortedFoodItems.filter((foodItem) => {
      return foodItem.foodItemName
        .toLowerCase()
        .includes(filterText.toLowerCase())
    })
  const isFitnessTrackFoodItem = (
    foodItem: FitnessTrackFoodItem | UserFoodItem
  ): foodItem is FitnessTrackFoodItem => {
    return (foodItem as FitnessTrackFoodItem).subCategoryId !== undefined
  }

  const handleEditClick = (foodItem: FitnessTrackFoodItem | UserFoodItem) => {
    if (isFitnessTrackFoodItem(foodItem)) {
      setEditFoodDialogOpen({
        open: true,
        foodItem: foodItem,
      })
    }
  }

  const Row: React.FC<RowProps> = ({ foodItem }) => {
    const [open, setOpen] = React.useState(false)
    const { foodItemName, calories, protein, fat, carbohydrates, foodItemId } =
      foodItem

    const FoodItemData: React.FC<RowProps> = ({ foodItem }) => {
      const { calories, protein, fat, carbohydrates } = foodItem
      return (
        <Box sx={{ margin: 1 }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography>Calories</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">{calories}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography>Protein</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">{protein}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography>Fat</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">{fat}</Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography>Carbs</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography align="right">{carbohydrates}</Typography>
            </Grid>
          </Grid>
        </Box>
      )
    }
    return (
      <>
        <TableRow
          // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          sx={{ '& > *': { borderBottom: 'none' } }}
        >
          <TableCell padding="none">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {foodItemName}
          </TableCell>
          {isAdmin && (
            <>
              <TableCell size="small" padding="none" align="right">
                <IconButton
                  onClick={() => {
                    handleEditClick(foodItem)
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell size="small" padding="none" align="right">
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
                  // sx={{ padding: 0 }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </>
          )}
        </TableRow>
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={1}
          ></TableCell>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <FoodItemData foodItem={foodItem} />
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  const generatedRows = filteredFoodItems.map(
    (foodItem: FitnessTrackFoodItem | UserFoodItem, index) => {
      // if (isFitnessTrackFoodItem(foodItem)) {
      //   return <Row foodItem={foodItem} />
      // }
      return <Row foodItem={foodItem} key={`row-${index}`} />
    }
  )

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
              {foodItems.length === 0 ? (
                emptyTable
              ) : (
                <Table
                  // sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="food-items-table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: '10%',
                          paddingLeft: '0px',
                          paddingRight: '0px',
                        }}
                      />
                      <TableCell>Name</TableCell>
                      {isAdmin && (
                        <>
                          <TableCell
                            align="right"
                            size="small"
                            sx={{
                              width: '10%',
                              paddingLeft: '0px',
                              paddingRight: '0px',
                            }}
                          >
                            {''}
                          </TableCell>
                          <TableCell
                            align="right"
                            size="small"
                            sx={{
                              width: '10%',
                              paddingLeft: '0px',
                              paddingRight: '0px',
                            }}
                          >
                            {''}
                          </TableCell>
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
    </Grid>
  )
}
