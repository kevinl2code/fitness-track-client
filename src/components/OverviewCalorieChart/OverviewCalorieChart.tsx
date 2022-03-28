import { Paper, Grid, Container, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
  TooltipProps,
  ReferenceArea,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'
import { DailyEntry, EntryConsumable } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { first, last } from 'lodash'

interface Props {
  entries: DailyEntry[]
}

export const OverviewCalorieChart: React.FC<Props> = ({ entries }) => {
  const calculateEntryActualCalories = (consumables: EntryConsumable[]) => {
    const confirmedConsumables = consumables?.length > 0 ? consumables : null
    const caloriesConsumed =
      confirmedConsumables?.reduce(
        (acc, consumable) => acc + consumable.calories,
        0
      ) || 0
    return caloriesConsumed
  }

  const graphData = entries.map((entry) => {
    return {
      name: DateTime.fromISO(entry.entryDate).toFormat('MMM dd'),
      actualCalories: calculateEntryActualCalories(entry.dailyEntryConsumables),
      targetCalories: entry.targetCalories,
    }
  })

  const defaultTooltipValues = {
    name: last(graphData)?.name ?? '-',
    actualCalories: last(graphData)?.actualCalories ?? 0,
    targetCalories: last(graphData)?.targetCalories ?? 0,
  }
  console.log(graphData)
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
        sx={{ marginBottom: 10, color: 'primary.main' }}
        align="center"
        fontWeight={700}
        fontSize="1.5rem"
      >
        Calorie Consumption
      </Typography>
      <Grid
        item
        xs={12}
        container
        direction="column"
        sx={{ height: '300px', width: '100%' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={graphData}
            margin={{
              // top: 5,
              right: 0,
              left: -18,
              bottom: 5,
            }}
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval="preserveStartEnd" minTickGap={30} />
            <YAxis domain={['auto', 'auto']} tickCount={4} />
            <Legend />

            <Tooltip
              content={(props) => (
                <CustomTooltip
                  {...props}
                  defaultValues={defaultTooltipValues}
                />
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
            <Bar dataKey="actualCalories" fill="#8884d8" />
            <Bar dataKey="targetCalories" fill="#82ca9d" />
            <ReferenceArea isFront={false} />
          </BarChart>
        </ResponsiveContainer>
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
    actualCalories: number
    targetCalories: number
  }
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  payload,
  defaultValues,
}) => {
  const hasValues = !!first(payload)?.payload
  const values = first(payload)?.payload ?? defaultValues
  const date = values.name
  const actualCalories = (Math.round(values.actualCalories * 10) / 10).toFixed(
    1
  )
  const targetCalories = (Math.round(values.targetCalories * 10) / 10).toFixed(
    1
  )

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
          <ToolTipDisplayItem label="Actual" value={actualCalories} />
          <ToolTipDisplayItem value={date} />
          <ToolTipDisplayItem label="Target" value={targetCalories} />
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
