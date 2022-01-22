import { Grid, Typography } from '@mui/material'
import React from 'react'

interface Props {
  text: string
  value: string | number
}

export const DashboardSummaryCardRow: React.FC<Props> = ({ text, value }) => {
  return (
    <Grid
      item
      container
      justifyContent="space-between"
      sx={{ marginTop: '1rem' }}
    >
      <Grid item>
        <Typography>{text}</Typography>
      </Grid>
      <Grid item>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  )
}
