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
import React from 'react'
import { FitnessTrackFoodItem } from '../../model/Model'
import SearchIcon from '@mui/icons-material/Search'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import AddCircleIcon from '@mui/icons-material/AddCircle'

interface Props {
  isAdmin: boolean
  foodItems: FitnessTrackFoodItem[]
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FoodsTable: React.FC<Props> = ({
  isAdmin,
  foodItems,
  setAddFoodDialogOpen,
}) => {
  const { matchesMD } = useMediaQueries()
  const generatedRows = foodItems.map((foodItem, index) => {
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
      </TableRow>
    )
  })

  return (
    <Paper elevation={0} variant={matchesMD ? 'outlined' : 'elevation'}>
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
                aria-label="add meal"
                onClick={() => setAddFoodDialogOpen(true)}
              >
                <AddCircleIcon fontSize="large" />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={0}>
            <Table
              // sx={{ minWidth: 650 }}
              size="small"
              aria-label="daily-entries-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Protein</TableCell>
                  <TableCell align="right">Fat</TableCell>
                  <TableCell align="right">Carbs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{generatedRows}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  )
}
