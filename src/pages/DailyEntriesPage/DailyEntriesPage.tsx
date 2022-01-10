import { Card, Divider, Grid, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import { DailyEntryCardItem } from '../../components/DailyEntryCardItem'
import React, { useCallback, useEffect } from 'react'
import { DateTime } from 'luxon'
import { DataService } from '../../services/DataService'
import { DailyEntry } from '../../model/Model'
import { DailyEntryMealsTable } from '../../components/DailyEntryMealsTable'
import { DailyEntryCreateNew } from '../../components/DailyEntryCreateNew'

const today = DateTime.now().toJSDate()

export const DailyEntriesPage: React.FC = () => {
  const [pickerDate, setPickerDate] = React.useState<Date | null>(today)
  const [entry, setEntry] = React.useState<DailyEntry[] | []>([])

  const currentDate = pickerDate?.toLocaleString()
  const getData = useCallback(async () => {
    // const currentDate = pickerDate?.toLocaleString()
    if (currentDate) {
      const dataservice = new DataService()
      const data = await dataservice.getDailyEntryByDate(currentDate)
      setEntry(data)
    }
  }, [currentDate])

  useEffect(() => {
    getData()
  }, [getData, pickerDate])
  if (entry) {
    console.log(entry[0]?.weight)
  }

  const haveEntry = entry.length > 0

  const weight = haveEntry ? entry[0]?.weight : '-'
  const activityLevel = haveEntry ? entry[0]?.activityLevel : '-'

  const mealRows = haveEntry
    ? entry[0].meals.map((meal) => {
        return meal
      })
    : []

  return (
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
        {haveEntry ? (
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
            <DailyEntryMealsTable rows={mealRows} />{' '}
          </>
        ) : (
          <DailyEntryCreateNew date={currentDate!} />
        )}
      </Grid>
    </Grid>
  )
}
