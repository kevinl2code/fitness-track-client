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

const today = DateTime.now().toLocaleString()
const testDate = new Date(today)

export const DailyEntriesPage: React.FC = () => {
  const [pickerDate, setPickerDate] = useState<Date | null>(testDate)
  const [entry, setEntry] = useState<DailyEntry[] | []>([])
  const [loading, setLoading] = useState(true)
  const [openMealDialog, setOpenMealDialog] = React.useState(false)

  const handleOpenAddMealDialog = () => {
    setOpenMealDialog(true)
  }

  const handleCloseAddMealDialog = () => {
    setOpenMealDialog(false)
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
  }, [currentDate, openMealDialog])

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
        />
        <Divider light />
        <DailyEntryCardItem
          fieldType="activity"
          fieldLabel="Activity Level"
          fieldValue={activityLevel}
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
