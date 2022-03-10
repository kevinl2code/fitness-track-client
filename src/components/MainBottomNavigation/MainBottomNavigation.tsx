import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import React from 'react'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import HomeIcon from '@mui/icons-material/Home'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../navigation'

const valueMap: {
  [key: string]: number
} = {
  dailyEntries: 0,
  dashboard: 1,
  plan: 2,
  foods: 3,
  more: 4,
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
          label="Entries"
          icon={<EventAvailableIcon />}
          onClick={() => navigate(ROUTES.dailyEntries)}
        />
        <BottomNavigationAction
          label="Overview"
          icon={<StackedLineChartIcon />}
          onClick={() => navigate(ROUTES.dashboard)}
        />
        <BottomNavigationAction
          label="Plan"
          icon={<AssignmentOutlinedIcon />}
          onClick={() => navigate(ROUTES.plan)}
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
