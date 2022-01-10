import {
  TableContainer,
  Paper,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import React from 'react'
import { Meal } from '../../model/Model'

interface Props {
  rows: Meal[] | []
}

export const DailyEntryMealsTable: React.FC<Props> = ({ rows }) => {
  const generatedRows = rows.map((row) => (
    <TableRow
      key={row.name}
      // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell align="right">{row.calories}</TableCell>
      <TableCell align="right">{row.protein}</TableCell>
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
              <button>Click</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
