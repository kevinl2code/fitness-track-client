import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { ActivityLevel, DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { Calculate } from '../../utilities/Calculate'

interface Props {
  // user: string | null
}

export const DashboardPage: React.FC<Props> = (props: Props) => {
  const [entries, setEntries] = React.useState<DailyEntry[] | null>(null)
  const calculate = new Calculate()
  const getData = useCallback(async () => {
    const dataservice = new DataService()
    const data = await dataservice.getDailyEntries()
    setEntries(data)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  if (!entries) {
    return <h1>No entries</h1>
  }

  const generatedRows = entries.map((entry, index) => {
    const confirmedMeals = entry.meals.length > 0 ? entry.meals : null
    const caloriesConsumed =
      confirmedMeals?.reduce((acc, meal) => acc + meal.calories, 0) || 0

    const proteinConsumed =
      confirmedMeals?.reduce((acc, meal) => acc + meal.protein, 0) || 0
    return (
      <TableRow
        key={`${entry.date} + ${index}`}
        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {entry.date}
        </TableCell>
        <TableCell align="right">{caloriesConsumed}</TableCell>
        <TableCell align="right">{proteinConsumed}</TableCell>
        <TableCell align="right">{entry.activityLevel}</TableCell>
        <TableCell align="right">{entry.weight}</TableCell>
      </TableRow>
    )
  })

  return (
    <>
      {/* <h1>{props.user ?? 'nope'}</h1> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
    </>
  )
}
