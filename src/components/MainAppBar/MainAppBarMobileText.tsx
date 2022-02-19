import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../navigation'

const siblingWidth = document
  .getElementById('mobile-appbar-back-button')
  ?.getBoundingClientRect().width

export const MainAppBarMobileText: React.FC = () => {
  const { matchesSM, matchesXS } = useMediaQueries()
  const routeParams = useLocation()
  const navigate = useNavigate()
  const currentPath = routeParams.pathname.substring(1)
  const mainText: {
    [key: string]: string
  } = {
    'app/foods': 'Foods',
    'app/dailyEntries': 'Daily Entries',
    'app/dashboard': 'Dashboard',
    'app/admin': 'Admin',
    'app/more': 'More',
    'app/plan': 'Fitness Plan',
    'app/profile': 'Profile',
  }
  const isMoreSubSection = mainText[currentPath] === 'Profile' ? true : false
  const returnToMorePage = (
    <IconButton
      aria-label="delete"
      size="small"
      onClick={() => navigate(`${ROUTES.more}`)}
    >
      <NavigateBeforeIcon sx={{ color: 'white' }} fontSize="large" />
    </IconButton>
  )

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
          justifyContent={isMoreSubSection ? 'space-between' : 'center'}
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
          {isMoreSubSection && (
            <Grid item id="mobile-appbar-back-button">
              {returnToMorePage}
            </Grid>
          )}
          <Grid item>
            <Typography variant="h4">{mainText[currentPath]}</Typography>
          </Grid>

          {isMoreSubSection && (
            <Grid item sx={{ width: siblingWidth }}>
              <></>
            </Grid>
          )}
        </Grid>
      </AppBar>
    </Box>
  )
}
