import { Card, Divider, Grid, LinearProgress } from '@mui/material'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { DailyEntryCardItem } from '../../components/DailyEntryCardItem'
import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { UseApi } from './useApi'
import { DailyEntry } from '../../model/Model'
import { DailyEntryMealsTable } from '../../components/DailyEntryMealsTable'
import { DailyEntryCreateNew } from '../../components/DailyEntryCreateNew'
import { AddMealToDailyEntryDialog } from '../../components/dialogs/AddMealToDailyEntryDialog'
import { UpdateDailyEntryWeightDialog } from '../../components/dialogs/UpdateDailyEntryWeightDialog'
import { UpdateDailyEntryActivityLevelDialog } from '../../components/dialogs/UpdateDailyEntryActivityLevelDialog'

const today = DateTime.now().toLocaleString()
const testDate = new Date(today)

export const DailyEntriesPage: React.FC = () => {
  const [pickerDate, setPickerDate] = useState<Date | null>(testDate)
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [openMealDialog, setOpenMealDialog] = React.useState(false)
  const [openUpdateWeightDialog, setOpenUpdateWeightDialog] =
    React.useState(false)
  const [openUpdateActivityLevelDialog, setOpenUpdateActivityLevelDialog] =
    React.useState(false)

  const useApi = new UseApi(dailyEntry, setDailyEntry)
  const handleOpenAddMealDialog = () => {
    setOpenMealDialog(true)
  }
  console.log(dailyEntry)
  const handleOpenUpdateWeightDialog = () => {
    setOpenUpdateWeightDialog(true)
  }

  const handleOpenUpdateActivityLevelDialog = () => {
    setOpenUpdateActivityLevelDialog(true)
  }

  const currentlySelectedDate = pickerDate?.toLocaleString().split(',')[0]

  useEffect(() => {
    useApi.fetchPageData(currentlySelectedDate!, setLoading, setDailyEntry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentlySelectedDate,
    openMealDialog,
    openUpdateWeightDialog,
    openUpdateActivityLevelDialog,
  ])

  const weight = dailyEntry?.weight || '-'
  const activityLevel = dailyEntry?.activityLevel || '-'

  const mealRows =
    dailyEntry?.meals.map((meal) => {
      return meal
    }) || []

  const mainContent = dailyEntry ? (
    <>
      <Card variant="outlined" sx={{ marginBottom: '2rem' }}>
        <DailyEntryCardItem
          fieldType="weight"
          fieldLabel="Weight"
          fieldValue={`${weight} lbs`}
          openDialog={handleOpenUpdateWeightDialog}
        />
        <Divider light />
        <DailyEntryCardItem
          fieldType="activity"
          fieldLabel="Activity Level"
          fieldValue={activityLevel}
          openDialog={handleOpenUpdateActivityLevelDialog}
        />
      </Card>
      <DailyEntryMealsTable
        rows={mealRows}
        useApi={useApi}
        handleOpenAddMealDialog={handleOpenAddMealDialog}
      />{' '}
    </>
  ) : (
    <DailyEntryCreateNew date={currentlySelectedDate!} />
  )

  return (
    <>
      <UpdateDailyEntryWeightDialog
        entry={dailyEntry!}
        open={openUpdateWeightDialog}
        useApi={useApi}
        setDialogOpenState={setOpenUpdateWeightDialog}
      />
      <UpdateDailyEntryActivityLevelDialog
        entry={dailyEntry!}
        open={openUpdateActivityLevelDialog}
        setDialogOpenState={setOpenUpdateActivityLevelDialog}
      />
      <AddMealToDailyEntryDialog
        entry={dailyEntry!}
        open={openMealDialog}
        useApi={useApi}
        setDialogOpenState={setOpenMealDialog}
      />
      <Grid container>
        <Grid item xs={4}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              value={pickerDate}
              onChange={(newValue) => {
                setPickerDate(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={8}>
          {loading ? <LinearProgress /> : mainContent}
        </Grid>
      </Grid>
    </>
  )
}
