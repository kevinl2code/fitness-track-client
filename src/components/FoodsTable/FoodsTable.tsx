import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Collapse,
  Button,
  TablePagination,
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
import { EditFitnessTrackFoodItemDialog } from '../dialogs/EditFitnessTrackFoodItemDialog/EditFitnessTrackFoodItemDialog'
import { EditUserFoodItemDialog } from '../dialogs/EditUserFoodItemDialog'

interface Props {
  isAdmin: boolean
  foodItems: FitnessTrackFoodItem[] | UserFoodItem[]
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
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

export const FoodsTable: React.FC<Props> = ({
  isAdmin,
  foodItems,
  setAddFoodDialogOpen,
  setConfirmDeleteDialogOpen,
}) => {
  const [filterText, setFilterText] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editFitnessTrackFoodDialogOpen, setEditFitnessTrackFoodDialogOpen] =
    useState<{
      open: boolean
      foodItem: FitnessTrackFoodItem | null
    }>({
      open: false,
      foodItem: null,
    })
  const [editUserFoodDialogOpen, setEditUserFoodDialogOpen] = useState<{
    open: boolean
    foodItem: UserFoodItem | null
  }>({
    open: false,
    foodItem: null,
  })
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

  const isFitnessTrackFoodItem = (
    foodItem: FitnessTrackFoodItem | UserFoodItem
  ): foodItem is FitnessTrackFoodItem => {
    return (foodItem as FitnessTrackFoodItem).subCategoryId !== undefined
  }

  const getFilteredFoodItems = () => {
    if (sortedFoodItems.length > 0) {
      if (isFitnessTrackFoodItem(sortedFoodItems[0])) {
        const sortedFitnessTrackFoodItems: FitnessTrackFoodItem[] =
          sortedFoodItems as FitnessTrackFoodItem[]
        return sortedFitnessTrackFoodItems.filter(
          (foodItem: FitnessTrackFoodItem) => {
            return foodItem.foodItemName
              .toLowerCase()
              .includes(filterText.toLowerCase())
          }
        )
      } else {
        const sortedUserFoodItems: UserFoodItem[] =
          sortedFoodItems as UserFoodItem[]
        return sortedUserFoodItems.filter((foodItem) => {
          return foodItem.foodItemName
            .toLowerCase()
            .includes(filterText.toLowerCase())
        })
      }
    }
    return []
  }

  const filteredFoodItems = getFilteredFoodItems()

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEditClick = (foodItem: FitnessTrackFoodItem | UserFoodItem) => {
    if (isFitnessTrackFoodItem(foodItem)) {
      setEditFitnessTrackFoodDialogOpen({
        open: true,
        foodItem: foodItem,
      })
    } else {
      setEditUserFoodDialogOpen({
        open: true,
        foodItem: foodItem,
      })
    }
  }

  const Row: React.FC<RowProps> = ({ foodItem }) => {
    const [open, setOpen] = React.useState(false)
    const { foodItemName, foodItemId } = foodItem

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
          <TableCell padding="none" sx={{ borderBottom: 'none' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" sx={{ borderBottom: 'none' }}>
            {foodItemName}
          </TableCell>
          {isAdmin && (
            <>
              <TableCell
                size="small"
                padding="none"
                align="right"
                sx={{ width: '10%', borderBottom: 'none' }}
              >
                <IconButton
                  onClick={() => {
                    handleEditClick(foodItem)
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell
                size="small"
                padding="none"
                align="right"
                sx={{ width: '10%', borderBottom: 'none' }}
              >
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

  const generatedRows = filteredFoodItems
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((foodItem: FitnessTrackFoodItem | UserFoodItem, index) => {
      // if (isFitnessTrackFoodItem(foodItem)) {
      //   return <Row foodItem={foodItem} />
      // }
      return <Row foodItem={foodItem} key={`row-${index}`} />
    })

  const emptyTable = (
    <Table size="small" aria-label="empty-food-items-table">
      <TableHead>
        <TableRow>
          <TableCell align="center">No Food Items Found</TableCell>
        </TableRow>
      </TableHead>
      <TableBody></TableBody>
    </Table>
  )

  return (
    <>
      <EditFitnessTrackFoodItemDialog
        open={editFitnessTrackFoodDialogOpen.open}
        // dataService={dataService}
        foodItem={editFitnessTrackFoodDialogOpen.foodItem}
        setEditFoodDialogOpen={setEditFitnessTrackFoodDialogOpen}
        // fetchFoodItems={fetchFoodItems}
      />
      <EditUserFoodItemDialog
        open={editUserFoodDialogOpen.open}
        foodItem={editUserFoodDialogOpen.foodItem}
        setEditFoodDialogOpen={setEditUserFoodDialogOpen}
      />
      <Grid item md={8} xs={12}>
        <Paper elevation={0} variant={matchesMD ? 'outlined' : 'elevation'}>
          <Grid container>
            <Grid
              container
              item
              xs={12}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid container justifyContent="space-between" item xs={6}>
                <TextField
                  variant="standard"
                  id="outlined-start-adornment"
                  placeholder="Search"
                  sx={{ width: '100%', paddingLeft: 0 }}
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
              <TableContainer component={Paper} elevation={0}>
                {foodItems.length === 0 ? (
                  emptyTable
                ) : (
                  <Table size="small" aria-label="food-items-table">
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
                              align="center"
                              size="small"
                              colSpan={2}
                              sx={{
                                paddingLeft: '0px',
                                paddingRight: '0px',
                              }}
                            >
                              Actions
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>{generatedRows}</TableBody>
                  </Table>
                )}
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredFoodItems.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={[
                  {
                    '& .MuiTablePagination-toolbar': {
                      paddingLeft: '6px',
                      paddingRight: '0px',
                    },
                    '& .MuiTablePagination-actions': {
                      marginLeft: '12px',
                    },
                  },
                ]}
              />
            </Grid>
            {isAdmin && (
              <Grid
                item
                xs={12}
                container
                justifyContent="center"
                sx={{ marginTop: '1rem' }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  aria-label="add consumable"
                  onClick={() => setAddFoodDialogOpen(true)}
                  endIcon={<AddCircleIcon fontSize="large" />}
                >
                  Add New
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </>
  )
}
