import { Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import DateAdapter from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import EditIcon from '@mui/icons-material/Edit'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import { DailyEntryCardItem } from '../../components/DailyEntryCardItem'
import React from 'react'

export const DailyEntriesPage: React.FC = () => {
  const [value, setValue] = React.useState<Date | null>(null)

  const cardItem = (
    <CardContent>
      <Grid container>
        <Grid item container justifyContent="space-between" xs={3}>
          <Grid>
            <MonitorWeightOutlinedIcon fontSize="large" />
          </Grid>
          <Grid>
            <Typography>Weight</Typography>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ textAlign: 'end', paddingRight: '1rem' }}>
            211 lbs
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <EditIcon />
        </Grid>
      </Grid>
    </CardContent>
  )

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
            fieldValue="225 lbs"
          />
          <Divider light />
          <DailyEntryCardItem
            fieldType="activity"
            fieldLabel="Activity Level"
            fieldValue="Lightly Active"
          />
        </Card>
      </Grid>
    </Grid>
  )
}
