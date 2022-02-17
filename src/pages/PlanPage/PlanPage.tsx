import { Grid, Typography, Divider } from '@mui/material'
import React, { useContext } from 'react'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { CycleContext, UserContext, EntriesContext } from '../../app/App'
import { DateTime } from 'luxon'
import { PlanDetail } from '../../components/PlanDetail'
import { Sort } from '../../utilities/Sort'
import { DailyEntry } from '../../model/Model'

interface Props {}

export const PlanPage: React.FC<Props> = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const calculate = new Calculate()
  const convert = new Convert()
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries)
  if (!cycle) {
    return null
  }

  const {
    cycleType,
    startingWeight,
    endingWeight,
    goalWeight,
    startDate,
    endingDate,
    duration,
    isActive,
  } = cycle
  const currentWeight = sortedEntries
    ? sortedEntries[sortedEntries.length - 1]?.dailyEntryWeight
    : startingWeight
  const cycleStartDate = DateTime.fromISO(startDate)
  const today = DateTime.local()
  const expectedEndDate = cycleStartDate.plus({ days: duration })
  const actualEndDate = endingDate ? DateTime.fromISO(endingDate) : null
  const cycleEndDate = actualEndDate ?? expectedEndDate
  const daysSinceStart = Math.floor(today.diff(cycleStartDate, 'days').days)
  const daysRemaining = duration - daysSinceStart
  const weightChanged = currentWeight && startingWeight - currentWeight
  const weightChangedRatePerDay = weightChanged / daysSinceStart
  const projectedFinalWeightAtCurrentPace = (
    Math.round(
      (Math.abs(weightChangedRatePerDay * daysRemaining) +
        Math.abs(weightChanged)) *
        10
    ) / 10
  ).toFixed(1)
  console.log(sortedEntries)
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

  const goalText: {
    [key: string]: string
  } = {
    CUT: `Lose ${(startingWeight - goalWeight).toFixed(
      1
    )} lbs in ${duration} days!`,
    BULK: `Gain ${(goalWeight - startingWeight).toFixed(
      1
    )} lbs in ${duration} days!`,
    MAINTAIN: `Maintain current weight for ${duration} days!`,
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ marginTop: '1rem' }}
    >
      <Grid item>
        <Typography variant="h4">MY GOAL</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6">{goalText[cycleType]}</Typography>
      </Grid>
      <Divider sx={{ width: '90%', marginTop: '1rem' }} />
      <PlanDetail
        text={`Start Date:`}
        value={cycleStartDate.toLocaleString(DateTime.DATE_MED)}
      />
      <PlanDetail
        text={isActive ? 'Expected End Date:' : 'End Date:'}
        value={cycleEndDate.toLocaleString(DateTime.DATE_MED)}
      />
      <PlanDetail text={`Starting Weight:`} value={`${startingWeight} lbs`} />
      <PlanDetail
        text={isActive ? 'Current Weight:' : 'Ending Weight:'}
        value={isActive ? `${currentWeight} lbs` : `${endingWeight} lbs`}
      />

      <PlanDetail text={`Goal Weight:`} value={`${goalWeight} lbs`} />
      {status.pastTense !== 'maintained' && (
        <PlanDetail
          text={`Pounds ${status.pastTense}:`}
          value={(Math.round(Math.abs(weightChanged) * 10) / 10).toFixed(1)}
        />
      )}
      {cycleType !== 'MAINTAIN' && (
        <PlanDetail
          text={'Pounds to go:'}
          value={currentWeight ? (currentWeight - goalWeight).toFixed(1) : '-'}
        />
      )}
    </Grid>
  )
}
