import { Card, Divider, Grid, LinearProgress } from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import { DailyEntryCardItem } from '../../components/DailyEntryCardItem'
import React, { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { UseApi } from './UseApi'
import { DailyEntry } from '../../model/Model'
import {
  DailyEntryMealsTable,
  DailyEntryCreateNew,
  DailyEntryDetails,
} from '../../components'
import {
  UpdateDailyEntryWeightDialog,
  UpdateDailyEntryActivityLevelDialog,
  AddMealToDailyEntryDialog,
} from '../../components/dialogs'
import { CycleContext, UserContext } from '../../app/App'

const today = DateTime.now()
// const testDate = new Date(today)

export const DailyEntriesPage: React.FC = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const [pickerDate, setPickerDate] = useState<DateTime | null>(today)
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [openMealDialog, setOpenMealDialog] = React.useState(false)
  const [openUpdateWeightDialog, setOpenUpdateWeightDialog] =
    React.useState(false)
  const [openUpdateActivityLevelDialog, setOpenUpdateActivityLevelDialog] =
    React.useState(false)
  // console.log(user?.user)
  const currentlySelectedDate = pickerDate?.toISODate()?.split('-')?.join('')
  const useApi = new UseApi(
    user?.user!,
    user?.sub!,
    currentlySelectedDate,
    dailyEntry,
    setDailyEntry
  )
  const handleOpenAddMealDialog = () => {
    setOpenMealDialog(true)
  }

  const handleOpenUpdateWeightDialog = () => {
    setOpenUpdateWeightDialog(true)
  }

  const handleOpenUpdateActivityLevelDialog = () => {
    setOpenUpdateActivityLevelDialog(true)
  }

  useEffect(() => {
    useApi.fetchPageData(setLoading, setDailyEntry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlySelectedDate])
  console.log(cycle)
  const weight = dailyEntry?.dailyEntryWeight || '-'
  const activityLevel = dailyEntry?.dailyEntryActivityLevel || '-'

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
        rows={dailyEntry?.dailyEntryMeals}
        useApi={useApi}
        handleOpenAddMealDialog={handleOpenAddMealDialog}
      />{' '}
    </>
  ) : (
    <DailyEntryCreateNew
      date={currentlySelectedDate!}
      useApi={useApi}
      sub={user?.sub!}
      setLoading={setLoading}
      setDailyEntry={setDailyEntry}
    />
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
        useApi={useApi}
        setDialogOpenState={setOpenUpdateActivityLevelDialog}
      />
      <AddMealToDailyEntryDialog
        entry={dailyEntry!}
        open={openMealDialog}
        useApi={useApi}
        setDialogOpenState={setOpenMealDialog}
      />
      <Grid container>
        <Grid item xs={4} container justifyContent="flex-start">
          <Grid item xs={12} sx={{ marginBottom: '2rem' }}>
            {/* <LocalizationProvider dateAdapter={DateAdapter}> */}
            <DatePicker
              value={pickerDate}
              onChange={(newValue) => {
                setPickerDate(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            {/* </LocalizationProvider> */}
          </Grid>
          <Grid item xs={9}>
            <DailyEntryDetails dailyEntry={dailyEntry} />
          </Grid>
        </Grid>
        <Grid item xs={8}>
          {loading ? <LinearProgress /> : mainContent}
        </Grid>
      </Grid>
    </>
  )
}
