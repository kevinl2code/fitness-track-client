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
import { DailyEntry, UserState } from '../../model/Model'
import { Sort } from '../../utilities/Sort'
import { DateTime } from 'luxon'
import { Calculate } from '../../utilities/Calculate'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'

interface Props {
  entries: DailyEntry[]
  user: UserState
}

export const DashboardEntriesPanel: React.FC<Props> = ({ entries, user }) => {
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries!)
  const calculate = new Calculate()

  const generatedRows = sortedEntries.map((entry, index) => {
    const {
      dailyEntryActivityLevel,
      entryDate,
      dailyEntryWeight,
      dailyEntryConsumables,
    } = entry
    const { birthday, sex, height } = user
    const confirmedConsumables =
      dailyEntryConsumables.length > 0 ? dailyEntryConsumables : null
    const caloriesConsumed =
      confirmedConsumables?.reduce(
        (acc, consumable) => acc + consumable.calories,
        0
      ) || 0

    const proteinConsumed =
      confirmedConsumables?.reduce(
        (acc, consumable) => acc + consumable.protein,
        0
      ) || 0

    const proteinRequired = calculate.proteinRequiredForWeightLoss(
      dailyEntryWeight,
      dailyEntryActivityLevel
    )
    const proteinInRange =
      proteinRequired.minimum < proteinConsumed &&
      proteinConsumed < proteinRequired.maximum
    const proteinIndicatorColor = proteinInRange ? 'green' : 'red'
    const proteinIndicator = (
      <span
        style={{
          height: '1rem',
          width: '1rem',
          backgroundColor: proteinIndicatorColor,
          borderRadius: '50%',
          display: 'inline-block',
        }}
      ></span>
    )

    const renderActivity = {
      SEDENTARY: <AirlineSeatReclineNormalIcon fontSize="small" />,
      LIGHTLY_ACTIVE: <DirectionsRunIcon fontSize="small" />,
      MODERATELY_ACTIVE: (
        <>
          <DirectionsRunIcon fontSize="small" />
          <DirectionsRunIcon fontSize="small" />
        </>
      ),
      VERY_ACTIVE: (
        <>
          <DirectionsRunIcon fontSize="small" />
          <DirectionsRunIcon fontSize="small" />
          <DirectionsRunIcon fontSize="small" />
        </>
      ),
      EXTRA_ACTIVE: (
        <>
          <DirectionsRunIcon fontSize="small" />
          <DirectionsRunIcon fontSize="small" />
          <DirectionsRunIcon fontSize="small" />
          <DirectionsRunIcon fontSize="small" />
        </>
      ),
    }

    const bmr = calculate.BMR(
      height!,
      dailyEntryWeight,
      calculate.age(birthday!),
      sex!
    )
    const tdee = calculate.TDEE(bmr!, dailyEntryActivityLevel).split('.')[0]

    return (
      <TableRow
        key={`${entryDate} + ${index}`}
        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {DateTime.fromISO(entryDate).toFormat('MMM dd, yyyy')}
        </TableCell>
        <TableCell align="right">
          {renderActivity[dailyEntryActivityLevel]}
        </TableCell>
        <TableCell align="right">{proteinIndicator}</TableCell>
        <TableCell align="right">{caloriesConsumed}</TableCell>
        <TableCell align="right">{tdee}</TableCell>

        <TableCell align="right">{dailyEntryWeight}</TableCell>
      </TableRow>
    )
  })

  return (
    <TableContainer
      component={Paper}
      elevation={2}
      sx={{
        marginTop: '2rem',
        padding: '1rem 2rem 1rem 2rem',
        borderRadius: '2rem',
        marginBottom: '2rem',
      }}
    >
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="daily-entries-table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Activity&nbsp;Level</TableCell>
            <TableCell align="right">Protein</TableCell>
            <TableCell align="right">Calories Consumed</TableCell>
            <TableCell align="right">Calories Burned</TableCell>

            <TableCell align="right">Weight&nbsp;(lbs)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{generatedRows}</TableBody>
      </Table>
    </TableContainer>
  )
}
