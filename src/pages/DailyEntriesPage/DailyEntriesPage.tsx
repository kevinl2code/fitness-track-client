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

const today = DateTime.now().toJSDate()

export const DailyEntriesPage: React.FC = () => {
  const [value, setValue] = React.useState<Date | null>(today)
  const [entry, setEntry] = React.useState<DailyEntry[] | []>([])

  const getData = useCallback(async () => {
    const currentDate = value?.toLocaleString()
    if (currentDate) {
      const dataservice = new DataService()
      const data = await dataservice.getDailyEntryByDate(currentDate)
      setEntry(data)
    }
  }, [value])

  useEffect(() => {
    getData()
  }, [getData, value])
  if (entry) {
    console.log(entry[0]?.weight)
  }

  const haveEntry = entry.length > 0
  const weight = haveEntry ? entry[0]?.weight : '-'
  const activityLevel = haveEntry ? entry[0]?.activityLevel : '-'

  return (
    <Grid container>
      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            value={value}
            onChange={(newValue) => {
              setValue(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={8}>
        <Card variant="outlined">
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
      </Grid>
    </Grid>
  )
}
