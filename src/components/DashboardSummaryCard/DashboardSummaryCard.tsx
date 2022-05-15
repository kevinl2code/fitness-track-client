import { Divider, Grid, Paper, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import { CycleType, DailyEntry } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { DashboardSummaryCardRow } from './DashboardSummaryCardRow'

interface Props {
  cycleType: CycleType
  startingWeight: number
  goalWeight: number
  entries: DailyEntry[] | null
  startDate: string
  endDate: string
}

export const DashboardSummaryCard: React.FC<Props> = ({
  cycleType,
  startingWeight,
  goalWeight,
  entries,
  startDate,
  endDate,
}) => {
  const calculate = new Calculate()
  const currentWeight = entries
    ? entries[entries.length - 1]?.dailyEntryWeight
    : startingWeight
  const start = DateTime.fromISO(startDate)
  const today = DateTime.local()
  const daysSinceStart = Math.floor(today.diff(start, 'days').days)
  const planDuration = calculate.planDuration(startDate, endDate)
  const daysRemaining = planDuration - daysSinceStart
  const weightChanged = currentWeight && startingWeight - currentWeight
  const weightChangedRatePerDay = weightChanged / daysSinceStart
  const projectedFinalWeightAtCurrentPace = (
    Math.round(
      (Math.abs(weightChangedRatePerDay * daysRemaining) +
        Math.abs(weightChanged)) *
        10
    ) / 10
  ).toFixed(1)

  let status = {
    pastTense: '',
    currentTense: '',
  }

  if (weightChanged > 0) {
    status.pastTense = 'lost'
    status.currentTense = 'lose'
  } else if (weightChanged < 0) {
    status.pastTense = 'gained'
    status.currentTense = 'gain'
  } else {
    status.pastTense = 'maintained'
    status.currentTense = 'maintain'
  }

  const summaryText = () => {
    if (status.currentTense !== 'maintain') {
      return `You are currently on pace to ${status.currentTense} ${projectedFinalWeightAtCurrentPace}lbs by your goal date.`
    }
    return 'You are on track to maintain your current weight.'
  }

  return (
    <Paper
      elevation={2}
      sx={{
        padding: '0 1rem 1rem 1rem',
        borderRadius: '2rem',
        // marginBottom: '2rem',
        width: '100%',
      }}
    >
      <Grid container sx={{ padding: '1rem' }}>
        <Grid item xs={12} container justifyContent="center">
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Progress Report
          </Typography>
        </Grid>
        <DashboardSummaryCardRow
          text={'Days since start:'}
          value={daysSinceStart}
        />
        <DashboardSummaryCardRow
          text={'Days remaining:'}
          value={daysRemaining}
        />
        <DashboardSummaryCardRow
          text={'Starting Weight:'}
          value={startingWeight}
        />
        <DashboardSummaryCardRow
          text={'Current Weight:'}
          value={currentWeight ?? '-'}
        />

        {status.pastTense !== 'maintained' && (
          <DashboardSummaryCardRow
            text={`Pounds ${status.pastTense}:`}
            value={(Math.round(Math.abs(weightChanged) * 10) / 10).toFixed(1)}
          />
        )}
        {cycleType !== 'MAINTAIN' && (
          <DashboardSummaryCardRow
            text={'Pounds to go:'}
            value={
              currentWeight ? (currentWeight - goalWeight).toFixed(1) : '-'
            }
          />
        )}
        <Divider
          variant="middle"
          sx={{ minWidth: '100%', margin: '1rem 0 1rem 0' }}
        />
        <Grid item xs={12} container justifyContent="center">
          <Typography align="center" sx={{ fontSize: '1rem', fontWeight: 700 }}>
            {summaryText()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
