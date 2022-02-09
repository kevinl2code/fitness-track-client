import { Grid, Button } from '@mui/material'
import React from 'react'
import { DailyEntryMetricView } from '..'
import { DailyEntry, UserState } from '../../model/Model'
import { UseApi } from '../../pages/DailyEntriesPage/UseApi'
import { DailyEntryConsumablesTable } from '../DailyEntryConsumablesTable/DailyEntryConsumablesTable'
import { DailyEntryGaugeChart } from '../DailyEntryGaugeChart'

interface Props {
  dailyEntry: DailyEntry
  user: UserState
  displayWeight: number | '-'
  isFirstDay: boolean
  isEditable: boolean
  useApi: UseApi
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
  isEditable,
  useApi,
  activityLevel,
  setOpenConsumableDialog,
  setOpenUpdateActivityLevelDialog,
  setOpenUpdateWeightDialog,
}) => {
  return (
    <>
      <Grid container justifyContent="center">
        <DailyEntryGaugeChart dailyEntry={dailyEntry} user={user} />
      </Grid>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: '1rem', marginBottom: '2rem' }}
      >
        <Button
          variant="contained"
          sx={{ width: '50%' }}
          onClick={() => {
            setOpenConsumableDialog(true)
          }}
        >
          Add Food
        </Button>
      </Grid>
      <Grid
        container
        justifyContent="space-evenly"
        sx={{ marginBottom: '1rem', top: '-100px' }}
      >
        <DailyEntryMetricView
          fieldType="weight"
          fieldLabel="Weight"
          fieldValue={`${displayWeight} lbs`}
          canEdit={isFirstDay || !isEditable ? false : true}
          openDialog={() => {
            setOpenUpdateWeightDialog(true)
          }}
        />
        <DailyEntryMetricView
          fieldType="activity"
          fieldLabel="Activity Level"
          fieldValue={activityLevel}
          canEdit={isEditable}
          openDialog={() => {
            setOpenUpdateActivityLevelDialog(true)
          }}
        />
      </Grid>
      <DailyEntryConsumablesTable
        rows={dailyEntry?.dailyEntryConsumables}
        useApi={useApi}
        handleOpenAddConsumableDialog={() => {
          setOpenConsumableDialog(true)
        }}
      />{' '}
    </>
  )
}
