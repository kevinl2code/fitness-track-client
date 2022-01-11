import {
  TableContainer,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import React from 'react'
import { Meal } from '../../model/Model'

interface Props {
  rows: Meal[] | []
  handleOpenAddMealDialog: () => void
}

export const DailyEntryMealsTable: React.FC<Props> = ({
  rows,
  handleOpenAddMealDialog,
}) => {
  const generatedRows = rows.map((row, index) => (
    <TableRow
      key={`${row.name} + ${index}`}
      // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell align="right">{row.calories}</TableCell>
      <TableCell align="right">{row.protein}</TableCell>
      <TableCell align="right">
        <IconButton></IconButton>
        <DeleteIcon />
      </TableCell>
    </TableRow>
  ))

  return (
    <TableContainer component={Card} variant="outlined">
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Meal</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generatedRows}
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Add a meal
            </TableCell>
            <TableCell align="right">{''}</TableCell>
            <TableCell align="right">
              <IconButton
                color="primary"
                aria-label="add meal"
                onClick={handleOpenAddMealDialog}
              >
                <AddCircleIcon fontSize="large" />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
