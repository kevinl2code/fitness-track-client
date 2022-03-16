import { CircularProgress, Grid } from '@mui/material'
import React from 'react'

export const PageLoading: React.FC = () => {
  return (
    <Grid container sx={{ height: '100%' }}>
      <CircularProgress />
    </Grid>
  )
}
