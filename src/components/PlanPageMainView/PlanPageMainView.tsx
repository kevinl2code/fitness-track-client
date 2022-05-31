import { Grid, Typography, Divider, Button } from '@mui/material'
import { stubTrue } from 'lodash'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { Cycle, DailyEntry } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { ListSection } from '../ListSection'
import { ListSectionDetails } from '../ListSection/ListSection'

interface Props {
  selectedCycle: Cycle
  editEnabled: boolean
  sortedEntries: DailyEntry[]
  pickerDate: DateTime
  mutableGoalWeight: number
  setDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setOpenUpdateGoalWeightDialog: React.Dispatch<React.SetStateAction<boolean>>
}

export const PlanPageMainView: React.FC<Props> = ({
  selectedCycle,
  editEnabled,
  sortedEntries,
  pickerDate,
  mutableGoalWeight,
  setDatePickerOpen,
  setOpenUpdateGoalWeightDialog,
}) => {
  const calculate = new Calculate()
  const {
    cycleType,
    startingWeight,
    endingWeight,
    goalWeight,
    startDate,
    endingDate,
    isActive,
  } = selectedCycle
  const currentWeight = sortedEntries
    ? sortedEntries[sortedEntries.length - 1]?.dailyEntryWeight
    : startingWeight
  const cycleStartDate = DateTime.fromISO(startDate)
  const planDuration = calculate.planDuration(
    selectedCycle.startDate,
    selectedCycle.endingDate
  )
  const today = DateTime.local()

  const cycleEndDate = DateTime.fromISO(endingDate)
  const daysSinceStart = Math.floor(today.diff(cycleStartDate, 'days').days)
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

  const milestones = {
    quarter: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        const milestone =
          (startingWeight - goalWeight) * 0.75 + parseInt(goalWeight.toString())
        return entry.dailyEntryWeight < milestone
      }
      return null
    }),
    half: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        const milestone =
          (startingWeight - goalWeight) * 0.5 + parseInt(goalWeight.toString())
        return entry.dailyEntryWeight < milestone
      }
      return null
    }),
    threeQuarters: sortedEntries.find((entry) => {
      if (cycleType === 'CUT') {
        const milestone =
          (startingWeight - goalWeight) * 0.25 + parseInt(goalWeight.toString())
        // console.log({ milestone, goalWeight })
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
    )} lbs in ${planDuration} days!`,
    BULK: `Gain ${(goalWeight - startingWeight).toFixed(
      1
    )} lbs in ${planDuration} days!`,
    MAINTAIN: `Maintain current weight for ${planDuration} days!`,
  }

  const dateSection: ListSectionDetails[] = [
    {
      itemName: 'Plan Start',
      itemType: 'text',
      secondaryText: cycleStartDate.toLocaleString(DateTime.DATE_MED),
    },
    {
      itemName: isActive ? 'Plan Expected End:' : 'Plan End:',
      itemType: editEnabled ? 'textButton' : 'text',
      secondaryText: pickerDate.toLocaleString(DateTime.DATE_MED),
      itemAction: editEnabled ? () => setDatePickerOpen(true) : undefined,
    },
  ]
  const weightSection: ListSectionDetails[] = [
    {
      itemName: 'Starting',
      itemType: 'text',
      secondaryText: `${startingWeight} lbs`,
    },
    {
      itemName: isActive ? 'Currently:' : 'Final:',
      itemType: 'text',
      secondaryText: isActive
        ? `${displayCurrentWeight} lbs`
        : `${endingWeight} lbs`,
    },
    {
      itemName: 'Goal',
      itemType: editEnabled ? 'textButton' : 'text',
      itemAction: () => setOpenUpdateGoalWeightDialog(true),
      secondaryText: `${mutableGoalWeight} lbs`,
    },
  ]

  const mileStoneSection: ListSectionDetails[] = [
    {
      itemName: 'Attained 25% of Goal',
      itemType: 'text',
      secondaryText: milestoneDate(milestones.quarter),
    },
    {
      itemName: 'Attained 50% of Goal',
      itemType: 'text',
      secondaryText: milestoneDate(milestones.half),
    },
    {
      itemName: 'Attained 75% of Goal',
      itemType: 'text',
      secondaryText: milestoneDate(milestones.threeQuarters),
    },
    {
      itemName: 'Attained 100% of Goal',
      itemType: 'text',
      secondaryText: milestoneDate(milestones.goal),
    },
  ]

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
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
  )
}
