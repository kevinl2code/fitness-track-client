import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material'
import React from 'react'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'
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
          icon={<RestoreIcon />}
          onClick={() => navigate(ROUTES.dashboard)}
        />
        <BottomNavigationAction
          label="Entries"
          icon={<FavoriteIcon />}
          onClick={() => navigate(ROUTES.dailyEntries)}
        />
        <BottomNavigationAction
          label="Foods"
          icon={<LocationOnIcon />}
          onClick={() => navigate(ROUTES.foods)}
        />
      </BottomNavigation>
    </Paper>
  )
}
