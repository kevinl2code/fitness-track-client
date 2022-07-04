import { Grid, LinearProgress, Paper, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { Cycle, DailyEntry } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { Sort } from '../../utilities/Sort'

interface Props {
  entries: DailyEntry[] | []
  cycle: Cycle | null
}

export const OverviewProgressSummary: React.FC<Props> = ({
  entries,
  cycle,
}) => {
  const [weightProgress, setWeightProgress] = useState(0)
  const [timeProgress, setTimeProgress] = useState(0)
  const calculate = new Calculate()
  const startDate = cycle?.startDate!
  const cycleStartDate = DateTime.fromISO(startDate)
  const today = DateTime.local()
  const cycleIsActive = cycle?.isActive!
  const cycleType = cycle?.cycleType!

  const planDuration = calculate.planDuration(
    cycle?.startDate!,
    cycle?.endingDate!
  )
  const latestEntry = entries[0]
  const startWeight = cycle?.startingWeight!
  const currentWeight = latestEntry.dailyEntryWeight
  const goalWeight = cycle?.goalWeight!

  const daysSinceStart = Math.floor(today.diff(cycleStartDate, 'days').days)
  const daysRemaining = planDuration - daysSinceStart

  const percentOfTimeElapsed = cycleIsActive
    ? (daysSinceStart / planDuration) * 100
    : 100
  useEffect(() => {
    const plannedTotalWeightChange: {
      [key: string]: number
    } = {
      CUT: startWeight - goalWeight,
      BULK: goalWeight - startWeight,
      MAINTAIN: 0,
    }
    const actualTotalWeightChange: {
      [key: string]: number
    } = {
      CUT: startWeight - currentWeight,
      BULK: currentWeight - startWeight,
      MAINTAIN: currentWeight - goalWeight,
    }
    const percentTowardWeightGoal = {
      CUT:
        (actualTotalWeightChange[cycleType] /
          plannedTotalWeightChange[cycleType]) *
        100,
      BULK:
        (actualTotalWeightChange[cycleType] /
          plannedTotalWeightChange[cycleType]) *
        100,
      MAINTAIN: 0,
    }
    setWeightProgress(percentTowardWeightGoal[cycleType])
    setTimeProgress(percentOfTimeElapsed)
  }, [currentWeight, cycleType, goalWeight, percentOfTimeElapsed, startWeight])

  if (!cycle) {
    return null
  }
  return (
    <Paper
      elevation={0}
      variant={'elevation'}
      sx={{
        padding: '2rem 8px 1rem 8px',
        borderRadius: '2rem',
        width: '100%',
      }}
    >
      <Typography
        sx={{ marginBottom: 5, color: 'primary.main' }}
        align="center"
        fontWeight={700}
        fontSize="1.5rem"
      >
        Progress Summary
      </Typography>
      <ProgressDisplay
        label="Progress to Goal"
        progressPercent={weightProgress}
      />
      {/* <LinearProgress variant="determinate" value={timeProgress} /> */}
      <ProgressDisplay label="Time Elapsed" progressPercent={timeProgress} />
      {/* <Grid
        item
        xs={12}
        container
        direction="column"
        sx={{ height: '300px', width: '100%' }}
      ></Grid> */}
    </Paper>
  )
}

interface ProgressDisplayProps {
  progressPercent: number
  label: string
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  progressPercent,
  label,
}) => {
  return (
    <Grid container alignItems="center">
      <Grid item xs={10}>
        <LinearProgress variant="determinate" value={progressPercent} />
      </Grid>
      <Grid item xs={2}>
        <Typography textAlign="right">{`${progressPercent.toFixed(
          1
        )}%`}</Typography>
      </Grid>

      <Grid item xs={10}>
        <Typography textAlign="center">{label}</Typography>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  )
}
