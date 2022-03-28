import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useMediaQueries } from '../../utilities/useMediaQueries'

const donutLove = `${process.env.PUBLIC_URL}/donutlove.svg`
export const DailyEntryMissedDay: React.FC = () => {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ marginTop: '2rem' }}
    >
      <Typography
        textAlign="center"
        variant="h6"
        sx={{ color: 'primary.main', fontWeight: 700, marginBottom: '1rem' }}
      >
        Oops! Looks like you missed a day. Once you resuming weighing in this
        page will update with estimated values.
      </Typography>
      <img
        src={donutLove}
        alt="People being active"
        style={{ width: '50%', height: 'auto' }}
      />
    </Grid>
  )
}
