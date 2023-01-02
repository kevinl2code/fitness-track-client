import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useMediaQueries } from '../../../utilities/useMediaQueries'

interface Props {
  daysRemaining: number
}

const plottingData = `${process.env.PUBLIC_URL}/plottingData.svg`

export const DashboardInsufficientData: React.FC<Props> = ({
  daysRemaining,
}) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', marginTop: '2rem' }}
    >
      <img
        src={plottingData}
        alt="Charting Data"
        style={{ width: '80%', height: 'auto' }}
      />
      <Typography
        textAlign="center"
        variant="h6"
        sx={{
          width: '80%',
          color: 'primary.main',
          fontWeight: 700,
          marginTop: '2rem',
        }}
      >
        {`It's still too early to provide an overview of your progress.  Check back in ${daysRemaining} days for an up to date report!`}
      </Typography>
    </Grid>
  )
}
