import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { CycleType } from '../../model/Model'

interface Props {
  cycleType: CycleType
  startingWeight: number
  goalWeight: number
  startDate: string
  duration: number
}

export const DashboardGoalPanel: React.FC<Props> = ({
  cycleType,
  startingWeight,
  goalWeight,
  startDate,
  duration,
}) => {
  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <Typography>Cycle Type:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{cycleType}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <Typography>Starting Weight</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{startingWeight}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <Typography>Goal Weight</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{goalWeight}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <Typography>Start Date</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{startDate}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} container>
            <Grid item xs={6}>
              <Typography>Duration</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{`${duration} days`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
