import { Grid, Typography } from '@mui/material'
import React from 'react'

interface Props {
  text: string
  value: string | number
}

export const PlanDetail: React.FC<Props> = ({ text, value }) => {
  return (
    <Grid
      item
      container
      justifyContent="space-between"
      sx={{ marginTop: '1rem', padding: '0 1rem 0 1rem' }}
    >
      <Grid item>
        <Typography variant="h6">{text}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  )
}
