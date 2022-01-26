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
} from '@mui/material'
import React from 'react'
import { FitnessTrackFoodItem } from '../../model/Model'

interface Props {
  foodItems: FitnessTrackFoodItem[]
}

export const FoodsTable: React.FC<Props> = ({ foodItems }) => {
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
    <Paper>
      <Grid container>
        <Grid container item xs={12}>
          <Typography>Values per 100g serving</Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer
            component={Card}
            // elevation={1}
            // variant="outlined"
            // sx={{
            //   marginTop: '2rem',
            //   padding: '1rem 2rem 1rem 2rem',
            //   borderRadius: '2rem',
            //   marginBottom: '2rem',
            // }}
          >
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
