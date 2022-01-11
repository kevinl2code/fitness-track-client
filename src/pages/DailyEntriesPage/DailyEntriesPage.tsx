import { Card, Divider, Grid, LinearProgress } from '@mui/material'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { DailyEntryCardItem } from '../../components/DailyEntryCardItem'
import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { DataService } from '../../services/DataService'
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
  const [entry, setEntry] = useState<DailyEntry[] | []>([])
  const [loading, setLoading] = useState(true)
  const [openMealDialog, setOpenMealDialog] = React.useState(false)
  const [openUpdateWeightDialog, setOpenUpdateWeightDialog] =
    React.useState(false)
  const [openUpdateActivityLevelDialog, setOpenUpdateActivityLevelDialog] =
    React.useState(false)

  const handleOpenAddMealDialog = () => {
    setOpenMealDialog(true)
  }

  const handleCloseAddMealDialog = () => {
    setOpenMealDialog(false)
  }

  const handleOpenUpdateWeightDialog = () => {
    setOpenUpdateWeightDialog(true)
  }

  const handleCloseUpdateWeightDialog = () => {
    setOpenUpdateWeightDialog(false)
  }
  const handleOpenUpdateActivityLevelDialog = () => {
    setOpenUpdateActivityLevelDialog(true)
  }

  const handleCloseUpdateActivityLevelDialog = () => {
    setOpenUpdateActivityLevelDialog(false)
  }

  const currentDate = pickerDate?.toLocaleString().split(',')[0]

  useEffect(() => {
    const getData = async () => {
      if (currentDate) {
        const dataservice = new DataService()
        const data = await dataservice.getDailyEntryByDate(currentDate)
        setLoading(false)
        setEntry(data)
      }
    }
    getData()
  }, [
    currentDate,
    openMealDialog,
    openUpdateWeightDialog,
    openUpdateActivityLevelDialog,
  ])

  const haveEntry = entry.length > 0

  const weight = haveEntry ? entry[0]?.weight : '-'
  const activityLevel = haveEntry ? entry[0]?.activityLevel : '-'

  const mealRows = haveEntry
    ? entry[0].meals.map((meal) => {
        return meal
      })
    : []

  const mainContent = haveEntry ? (
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
        handleOpenAddMealDialog={handleOpenAddMealDialog}
      />{' '}
    </>
  ) : (
    <DailyEntryCreateNew date={currentDate!} />
  )

  return (
    <>
      <UpdateDailyEntryWeightDialog
        entry={entry[0]}
        open={openUpdateWeightDialog}
        handleClose={handleCloseUpdateWeightDialog}
      />
      <UpdateDailyEntryActivityLevelDialog
        entry={entry[0]}
        open={openUpdateActivityLevelDialog}
        handleClose={handleCloseUpdateActivityLevelDialog}
      />
      <AddMealToDailyEntryDialog
        entry={entry[0]}
        open={openMealDialog}
        handleClose={handleCloseAddMealDialog}
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
