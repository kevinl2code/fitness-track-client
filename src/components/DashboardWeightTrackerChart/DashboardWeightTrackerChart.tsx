import { Container, Grid, Paper, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'
import { DailyEntry, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { first, last } from 'lodash'

interface Props {
  entries: DailyEntry[]
  user: UserState
}

export const DashboardWeightTrackerChart: React.FC<Props> = ({
  entries,
  user,
}) => {
  const [alignment, setAlignment] = React.useState('week')
  const { matchesMD } = useMediaQueries()
  const { birthday, sex, height } = user
  const calculate = new Calculate()

  const handleToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment)
  }

  const tooltipName = (name: 'actualValue' | 'projectedValue') =>
    name === 'actualValue' ? 'Actual Weight' : 'Projected Weight'
  const calculatedEntries: {
    name: string
    actualValue: number
    projectedValue: number
  }[] = [
    {
      name: DateTime.fromISO(entries[0].entryDate).toFormat('MMM dd'),
      actualValue: entries[0].dailyEntryWeight,
      projectedValue: entries[0].dailyEntryWeight,
    },
  ]

  entries.reduce((previousValue, currentValue, index) => {
    const date = DateTime.fromISO(currentValue.entryDate).toFormat('MMM dd')
    const bmr = calculate.BMR(
      height!,
      calculatedEntries[index - 1].projectedValue,
      calculate.age(birthday!),
      sex!
    )
    const tdee = calculate.TDEE(bmr!, previousValue.dailyEntryActivityLevel)

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
    const caloriesRelativeToTDEE = tdee - previousDaysCalories

    const expectedWeightChange = caloriesRelativeToTDEE / 3500
    const missedPriorDay =
      parseInt(currentValue.entryDate) - parseInt(previousValue.entryDate) > 1
        ? true
        : false
    calculatedEntries.push({
      name: date,
      actualValue: currentValue.dailyEntryWeight,
      projectedValue: missedPriorDay
        ? currentValue.dailyEntryWeight
        : calculatedEntries[index - 1].projectedValue - expectedWeightChange,
    })
    return currentValue
  })
  console.log(calculatedEntries)
  const defaultTooltipValues = {
    name: last(calculatedEntries)?.name ?? '-',
    projectedValue: last(calculatedEntries)?.projectedValue ?? 0,
    actualValue: last(calculatedEntries)?.actualValue ?? 0,
  }

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
  console.log(domainMax)
  const domainMin = Math.round(
    Math.min(actualWeightMin, projectedWeightMin) * 0.99
  )

  const renderLineChart = (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        margin={{
          // top: 5,
          right: 0,
          left: -23,
          bottom: 5,
        }}
        data={calculatedEntries}
      >
        <Line
          type="monotone"
          dataKey="actualValue"
          stroke="#8884d8"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="projectedValue"
          stroke="green"
          strokeWidth={2}
        />
        <XAxis dataKey="name" interval="preserveStartEnd" minTickGap={30} />
        <YAxis
          // domain={[domainMin, domainMax]}
          domain={['auto', 'auto']}
          padding={{ bottom: 10 }}
          tickCount={4}
        />
        <Tooltip
          content={(props) => (
            <CustomTooltip {...props} defaultValues={defaultTooltipValues} />
          )}
          position={{ x: 0, y: -60 }}
          wrapperStyle={{
            visibility: 'visible',
            position: 'absolute',
            top: 0,
            left: 0,
            right: -8,
          }}
          allowEscapeViewBox={{ y: true }}
        />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Paper
      elevation={0}
      variant={matchesMD ? 'outlined' : 'elevation'}
      sx={{
        padding: '2rem 8px 1rem 8px',
        borderRadius: '2rem',
        width: '100%',
      }}
    >
      <Typography
        sx={{ marginBottom: 10, color: 'primary.main' }}
        align="center"
        fontWeight={700}
        fontSize="1.5rem"
      >
        Weight Change
      </Typography>
      <Grid
        item
        xs={12}
        container
        direction="column"
        sx={{ height: '300px', width: '100%' }}
      >
        {renderLineChart}
      </Grid>
      {/* <Grid container justifyContent="center">
        {' '}
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleToggleChange}
        >
          <ToggleButton value="week">7 Days</ToggleButton>
          <ToggleButton value="month">30 Days</ToggleButton>
          <ToggleButton value="overall">Overall</ToggleButton>
        </ToggleButtonGroup>
      </Grid> */}
    </Paper>
  )
}

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  defaultValues: {
    name: string
    projectedValue: number
    actualValue: number
  }
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  payload,
  defaultValues,
}) => {
  const hasValues = !!first(payload)?.payload
  const values = first(payload)?.payload ?? defaultValues
  const date = values.name
  const projectedValue = (Math.round(values.projectedValue * 10) / 10).toFixed(
    1
  )
  const actualValue = (Math.round(values.actualValue * 10) / 10).toFixed(1)

  return (
    <div
      style={{
        backgroundColor: 'white',
        position: 'relative',
        height: 70,
        width: '100%',
      }}
    >
      <Container maxWidth="sm" sx={{ height: '100%' }}>
        <Grid
          container
          alignItems="flex-end"
          justifyContent="space-evenly"
          spacing={2}
          sx={{ height: '100%', paddingRight: 2 }}
        >
          <ToolTipDisplayItem label="Projected" value={projectedValue} />
          <ToolTipDisplayItem value={date} />
          <ToolTipDisplayItem label="Actual" value={actualValue} />
        </Grid>
      </Container>
    </div>
  )
}

interface ToolTipDisplayItemProps {
  value: string
  label?: string
}

const ToolTipDisplayItem: React.FC<ToolTipDisplayItemProps> = ({
  label,
  value,
}) => {
  return (
    <Grid item>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item>
          <Typography fontWeight={700} fontSize={'1.5rem'}>
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
