import { Grid } from '@mui/material'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'

import React from 'react'

export const DailyEntriesPage: React.FC = () => {
  const [value, setValue] = React.useState<Date | null>(null)

  return (
    <Grid container>
      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DatePicker
            label="Basic example"
            value={value}
            onChange={(newValue) => {
              setValue(newValue)
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={8}>
        <h1>DAILY ENTRY</h1>
      </Grid>
    </Grid>
  )
}
