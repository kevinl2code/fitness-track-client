import { Grid, Typography, Divider, Button, Container } from '@mui/material'
import React, { useContext } from 'react'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { CycleContext, UserContext, EntriesContext } from '../../app/App'
import { DateTime } from 'luxon'
import { PlanDetail } from '../../components/PlanDetail'
import { Sort } from '../../utilities/Sort'
import { DailyEntry } from '../../model/Model'
import { ListSection } from '../../components/ListSection'
import { ListSectionDetails } from '../../components/ListSection/ListSection'

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

  const milestones = {
    quarter: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        const milestone =
          (startingWeight - goalWeight) * 0.75 + parseInt(goalWeight.toString())
        console.log({ milestone, goalWeight })
        return entry.dailyEntryWeight < milestone
      }
      return null
    }),
    half: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        const milestone =
          (startingWeight - goalWeight) * 0.5 + parseInt(goalWeight.toString())
        console.log({ milestone, goalWeight })
        return entry.dailyEntryWeight < milestone
      }
      return null
    }),
    threeQuarters: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        const milestone =
          (startingWeight - goalWeight) * 0.25 + parseInt(goalWeight.toString())
        console.log({ milestone, goalWeight })
        return entry.dailyEntryWeight < milestone
      }
      return null
    }),
    goal: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        return entry.dailyEntryWeight < goalWeight
      }
      return null
    }),
  }

  const milestoneDate = (milestoneEntry: DailyEntry | undefined) =>
    milestoneEntry?.entryDate
      ? DateTime.fromISO(milestoneEntry?.entryDate).toLocaleString(
          DateTime.DATE_MED
        )
      : '-'

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
  const displayCurrentWeight = currentWeight ? currentWeight : '-'
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

  const dateSection: ListSectionDetails[] = [
    {
      itemName: 'Plan Start',
      secondaryText: cycleStartDate.toLocaleString(DateTime.DATE_MED),
    },
    {
      itemName: isActive ? 'Plan Expected End:' : 'Plan End:',
      secondaryText: cycleEndDate.toLocaleString(DateTime.DATE_MED),
    },
  ]
  const weightSection: ListSectionDetails[] = [
    {
      itemName: 'Goal',
      secondaryText: `${goalWeight} lbs`,
    },
    {
      itemName: 'Starting',
      secondaryText: `${startingWeight} lbs`,
    },
    {
      itemName: isActive ? 'Currently:' : 'Final:',
      secondaryText: isActive
        ? `${displayCurrentWeight} lbs`
        : `${endingWeight} lbs`,
    },
  ]

  const mileStoneSection: ListSectionDetails[] = [
    {
      itemName: 'Attained 25% of Goal',
      secondaryText: milestoneDate(milestones.quarter),
    },
    {
      itemName: 'Attained 50% of Goal',
      secondaryText: milestoneDate(milestones.half),
    },
    {
      itemName: 'Attained 75% of Goal',
      secondaryText: milestoneDate(milestones.threeQuarters),
    },
    {
      itemName: 'Attained 100% of Goal',
      secondaryText: milestoneDate(milestones.goal),
    },
  ]

  return (
    <Container>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ marginTop: '1rem', width: '100%' }}
      >
        <Grid item>
          <Typography variant="h4">GOAL</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">{goalText[cycleType]}</Typography>
        </Grid>
        <Divider sx={{ width: '90%', marginTop: '1rem' }} />
        <ListSection
          sectionSubHeader="Dates"
          sectionItems={dateSection}
          justify="center"
        />
        <ListSection
          sectionSubHeader="Key Weights"
          sectionItems={weightSection}
          justify="center"
        />
        <ListSection
          sectionSubHeader="Milestones"
          sectionItems={mileStoneSection}
          justify="center"
        />
      </Grid>
    </Container>
    //   {status.pastTense !== 'maintained' && (
    //     <PlanDetail
    //       text={`Pounds ${status.pastTense}:`}
    //       value={(Math.round(Math.abs(weightChanged) * 10) / 10).toFixed(1)}
    //     />
    //   )}
    //   {cycleType !== 'MAINTAIN' && (
    //     <PlanDetail
    //       text={'Pounds to go:'}
    //       value={currentWeight ? (currentWeight - goalWeight).toFixed(1) : '-'}
    //     />
    //   )}
  )
}
