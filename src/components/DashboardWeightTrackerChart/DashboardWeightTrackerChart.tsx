import { Card, Grid, MenuItem, Paper, Select, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'util'
import { DailyEntry, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { Sort } from '../../utilities/Sort'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  entries: DailyEntry[]
  user: UserState
}

export const DashboardWeightTrackerChart: React.FC<Props> = ({
  entries,
  user,
}) => {
  const { matchesMD } = useMediaQueries()
  const { birthday, sex, height } = user
  const calculate = new Calculate()
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries!)
  const tooltipName = (name: 'actualValue' | 'projectedValue') =>
    name === 'actualValue' ? 'Actual Weight' : 'Projected Weight'
  const calculatedEntries: {
    name: string
    actualValue: number
    projectedValue: number
  }[] = [
    {
      name: DateTime.fromISO(sortedEntries[0].entryDate).toFormat('MMM dd'),
      actualValue: sortedEntries[0].dailyEntryWeight,
      projectedValue: sortedEntries[0].dailyEntryWeight,
    },
  ]

  sortedEntries.reduce((previousValue, currentValue, index) => {
    const date = DateTime.fromISO(currentValue.entryDate).toFormat('MMM dd')
    const bmr = calculate.BMR(
      height!,
      calculatedEntries[index - 1].projectedValue,
      calculate.age(birthday!),
      sex!
    )
    const tdee = calculate
      .TDEE(bmr!, previousValue.dailyEntryActivityLevel)
      .split('.')[0]

    //TODO - MAKE SURE THIS WORKS FOR GAINING AND MAINTAINING WEIGHT
    const confirmedConsumables =
      previousValue.dailyEntryConsumables.length > 0
        ? previousValue.dailyEntryConsumables
        : null
    const previousDaysCalories =
      confirmedConsumables?.reduce(
        (acc, consumable) => acc + consumable.calories,
        0
      ) || 0
    const caloriesRelativeToTDEE = parseInt(tdee) - previousDaysCalories

    const expectedWeightChange = caloriesRelativeToTDEE / 3500

    calculatedEntries.push({
      name: date,
      actualValue: currentValue.dailyEntryWeight,
      projectedValue:
        calculatedEntries[index - 1].projectedValue - expectedWeightChange,
    })
    return currentValue
  })

  const actualWeightMax = Math.max.apply(
    Math,
    calculatedEntries.map((entry) => entry.actualValue)
  )
  const actualWeightMin = Math.min.apply(
    Math,
    calculatedEntries.map((entry) => entry.actualValue)
  )

  const projectedWeightMax = Math.max.apply(
    Math,
    calculatedEntries.map((entry) => entry.projectedValue)
  )
  const projectedWeightMin = Math.min.apply(
    Math,
    calculatedEntries.map((entry) => entry.projectedValue)
  )

  const domainMax = Math.round(
    Math.max(actualWeightMax, projectedWeightMax) * 1.01
  )

  const domainMin = Math.round(
    Math.min(actualWeightMin, projectedWeightMin) * 0.99
  )

  const renderLineChart = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
        data={calculatedEntries}
      >
        <Line type="monotone" dataKey="actualValue" stroke="#8884d8" />
        <Line type="monotone" dataKey="projectedValue" stroke="green" />
        {/* <CartesianGrid stroke="#ccc" /> */}
        <XAxis
          dataKey="name"
          // interval="preserveStart"
          interval={0}
          angle={30}
          dx={20}
        />
        <YAxis domain={[domainMin, domainMax]} padding={{ bottom: 10 }} hide />
        <Tooltip
          formatter={(val: number, name: 'actualValue' | 'projectedValue') => [
            (Math.round(val * 10) / 10).toFixed(1),
            tooltipName(name),
          ]}
        />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Paper
      elevation={0}
      variant={matchesMD ? 'outlined' : 'elevation'}
      sx={{
        padding: '0 2rem 1rem 1rem',
        borderRadius: '2rem',
        width: '100%',
      }}
    >
      <Grid container justifyContent="space-between" sx={{ padding: '1rem' }}>
        <Grid item container justifyContent="center">
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Weight Tracker
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        container
        direction="column"
        sx={{ height: 300, width: '100%' }}
        // className={classes.chartContainer}
      >
        {renderLineChart}
      </Grid>
    </Paper>
  )
}
