import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import React from 'react'
import { DailyEntry } from '../../model/Model'
import { Sort } from '../../utilities/Sort'

interface Props {
  entries: DailyEntry[]
}

export const DashboardEntriesPanel: React.FC<Props> = ({ entries }) => {
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.byDate(entries!)

  const generatedRows = sortedEntries.map((entry, index) => {
    const confirmedMeals =
      entry.dailyEntryMeals.length > 0 ? entry.dailyEntryMeals : null
    const caloriesConsumed =
      confirmedMeals?.reduce((acc, meal) => acc + meal.calories, 0) || 0

    const proteinConsumed =
      confirmedMeals?.reduce((acc, meal) => acc + meal.protein, 0) || 0
    return (
      <TableRow
        key={`${entry.sortKey} + ${index}`}
        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {entry.sortKey}
        </TableCell>
        <TableCell align="right">{caloriesConsumed}</TableCell>
        <TableCell align="right">{proteinConsumed}</TableCell>
        <TableCell align="right">{entry.dailyEntryActivityLevel}</TableCell>
        <TableCell align="right">{entry.dailyEntryWeight}</TableCell>
      </TableRow>
    )
  })

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="daily-entries-table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right">Activity&nbsp;Level</TableCell>
            <TableCell align="right">Weight&nbsp;(lbs)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{generatedRows}</TableBody>
      </Table>
    </TableContainer>
  )
}
