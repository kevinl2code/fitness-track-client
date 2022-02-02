import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material'
import React from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import HomeIcon from '@mui/icons-material/Home'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../navigation'

export const MainBottomNavigation: React.FC = () => {
  const [value, setValue] = React.useState(0)
  const navigate = useNavigate()
  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<HomeIcon />}
          onClick={() => navigate(ROUTES.dashboard)}
        />
        <BottomNavigationAction
          label="Entries"
          icon={<EventAvailableIcon />}
          onClick={() => navigate(ROUTES.dailyEntries)}
        />

        <BottomNavigationAction
          label="Foods"
          icon={<RestaurantIcon />}
          onClick={() => navigate(ROUTES.foods)}
        />
        <BottomNavigationAction
          label="More"
          icon={<MoreVertIcon />}
          onClick={() => navigate(ROUTES.more)}
        />
      </BottomNavigation>
    </Paper>
  )
}
