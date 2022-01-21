import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { Inbox as InboxIcon } from '@mui/icons-material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import React from 'react'

type DrawerItemType = 'dashboard' | 'dailyEntries' | 'register' | 'settings'

interface Props {
  itemType: DrawerItemType
  label: string
  route: string
}

export const MainDrawerItem: React.FC<Props> = ({ itemType, label, route }) => {
  const navigate = useNavigate()
  const routeParams = useLocation()
  const currentPath = routeParams.pathname.substring(1)
  const isActive = currentPath === `app/${route}` ? 'active' : 'inactive'

  const backgroundColor = {
    active: '#81d4fa',
    inactive: 'default',
  }

  const primaryIcon = {
    dashboard: <DashboardOutlinedIcon fontSize="large" />,
    dailyEntries: <InboxIcon />,
    register: <InboxIcon />,
    settings: <InboxIcon />,
  }
  return (
    <ListItem
      button
      onClick={() => navigate(route)}
      sx={[
        { backgroundColor: backgroundColor[isActive] },
        isActive && {
          '&:hover': {
            backgroundColor: backgroundColor[isActive],
          },
        },
      ]}
    >
      <ListItemIcon>{primaryIcon[itemType]}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  )
}