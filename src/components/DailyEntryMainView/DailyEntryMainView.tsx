import { Grid, Button, Typography } from '@mui/material'
import React from 'react'
import { DailyEntryMetricView } from '..'
import { DailyEntry, UserState } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { Calculate } from '../../utilities/Calculate'
import { DailyEntryConsumablesTable } from '../DailyEntryConsumablesTable/DailyEntryConsumablesTable'
import { DailyEntryGaugeChart } from '../DailyEntryGaugeChart'

interface Props {
  dailyEntry: DailyEntry
  user: UserState
  displayWeight: number | '-'
  isFirstDay: boolean
  isLastDay: boolean
  isEditable: boolean
  dataService: DataService
  activityLevel: string
  setOpenConsumableDialog: (value: React.SetStateAction<boolean>) => void
  setOpenUpdateWeightDialog: (value: React.SetStateAction<boolean>) => void
  setOpenUpdateActivityLevelDialog: (
    value: React.SetStateAction<boolean>
  ) => void
}

export const DailyEntryMainView: React.FC<Props> = ({
  dailyEntry,
  user,
  displayWeight,
  isFirstDay,
  isLastDay,
  isEditable,
  dataService,
  activityLevel,
  setOpenConsumableDialog,
  setOpenUpdateActivityLevelDialog,
  setOpenUpdateWeightDialog,
}) => {
  const calculate = new Calculate()
  const {
    dailyEntryWeight,
    dailyEntryActivityLevel,
    dailyEntryConsumables,
    targetCalories,
  } = dailyEntry

  const { birthday, sex, height } = user!
  const age = calculate.age(birthday)

  const bmr = calculate.BMR(height, dailyEntryWeight, age, sex)
  const tdee = calculate.TDEE(bmr, dailyEntryActivityLevel)

  const confirmedConsumables =
    dailyEntryConsumables?.length > 0 ? dailyEntryConsumables : null
  const caloriesConsumed =
    confirmedConsumables?.reduce(
      (acc, consumable) => acc + consumable.calories,
      0
    ) || 0
  const exceededDailyTarget = caloriesConsumed > targetCalories
  const exceededTDEE = caloriesConsumed > tdee

  return (
    <>
      <Grid
        container
        justifyContent="center"
        id="dailyEntryMainContentContainer"
      >
        <DailyEntryGaugeChart
          caloriesConsumed={caloriesConsumed}
          targetCalories={targetCalories}
          tdee={tdee}
          user={user}
        />
      </Grid>
      {exceededDailyTarget && (
        <ExceededTextPanel subject="daily target" value={targetCalories} />
      )}
      {exceededTDEE && <ExceededTextPanel subject="tdee" value={tdee} />}
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: '1rem', marginBottom: '2rem' }}
      >
        {isEditable && (
          <Button
            variant="contained"
            sx={{ width: '50%' }}
            onClick={() => {
              setOpenConsumableDialog(true)
            }}
          >
            Add Food
          </Button>
        )}
      </Grid>
      <Grid
        container
        justifyContent="space-evenly"
        sx={{ marginBottom: '1rem', top: '-100px' }}
      >
        <DailyEntryMetricView
          fieldLabel="Weight"
          fieldValue={`${displayWeight} lbs`}
          canEdit={isFirstDay || !isEditable ? false : true}
          openDialog={() => {
            setOpenUpdateWeightDialog(true)
          }}
        />
        <DailyEntryMetricView
          fieldLabel="Activity Level"
          fieldValue={activityLevel}
          canEdit={isEditable}
          openDialog={() => {
            setOpenUpdateActivityLevelDialog(true)
          }}
        />
      </Grid>
      <DailyEntryConsumablesTable
        dataService={dataService}
        entry={dailyEntry}
        isEditable={isEditable}
      />{' '}
    </>
  )
}

interface ExceededTextPanelProps {
  subject: 'daily target' | 'tdee'
  value: number
}

const ExceededTextPanel: React.FC<ExceededTextPanelProps> = ({
  subject,
  value,
}) => {
  const color = {
    tdee: '#ef5350',
    'daily target': '#ff9800',
  }

  return (
    <Grid container justifyContent="center">
      <Typography sx={{ color: color[subject], fontWeight: 700 }}>
        {`Exceeded ${subject} of ${value} calories`}
      </Typography>
    </Grid>
  )
}
