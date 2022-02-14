import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useMediaQueries } from '../../utilities/useMediaQueries'

export const MainAppBarMobileText: React.FC = () => {
  const { matchesSM, matchesXS } = useMediaQueries()
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
    <Box
      sx={[
        { flexGrow: 1 },
        matchesXS && {
          minHeight: '56px',
        },
        matchesSM && {
          minHeight: '64px',
        },
      ]}
    >
      <AppBar
        position="fixed"
        sx={[
          { zIndex: (theme) => theme.zIndex.drawer + 2 },
          matchesXS && {
            minHeight: '56px',
          },
          matchesSM && {
            minHeight: '64px',
          },
        ]}
        elevation={0}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={[
            { flexGrow: 1 },
            matchesXS && {
              minHeight: '56px',
            },
            matchesSM && {
              minHeight: '64px',
            },
          ]}
        >
          <Grid item>
            <Typography variant="h4">{mainText[currentPath]}</Typography>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  )
}
