import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'

export const MainAppBarMobileText: React.FC = () => {
  const routeParams = useLocation()
  const currentPath = routeParams.pathname.substring(1)

  const mainText: {
    [key: string]: string
  } = {
    'app/foods': 'Foods',
    'app/dailyEntries': 'Daily Entries',
    'app/dashboard': 'Dashboard',
    'app/admin': 'Admin',
    'app/more': 'More',
  }

  return (
    <Grid
      container
      alignItems="flex-end"
      justifyContent="space-between"
      sx={{ height: '100%' }}
    >
      <Typography variant="h3">{mainText[currentPath]}</Typography>
    </Grid>
  )
}
