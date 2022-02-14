import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import React from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import HomeIcon from '@mui/icons-material/Home'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../navigation'

const valueMap: {
  [key: string]: number
} = {
  dashboard: 0,
  dailyEntries: 1,
  foods: 2,
  more: 3,
}

export const MainBottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const routeParams = useLocation()
  const splitRoute = routeParams.pathname.split('/')
  const currentView = splitRoute[2]
  const [value, setValue] = React.useState(valueMap[currentView])

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
