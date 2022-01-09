import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail as MailIcon, Inbox as InboxIcon } from '@mui/icons-material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import React from 'react'
import { ROUTES } from '../../navigation'

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
  const isActive = currentPath === route ? 'active' : 'inactive'
  const disableHoverEffect = isActive === 'active'

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
      sx={{ backgroundColor: backgroundColor[isActive] }}
    >
      <ListItemIcon>{primaryIcon[itemType]}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  )
}
