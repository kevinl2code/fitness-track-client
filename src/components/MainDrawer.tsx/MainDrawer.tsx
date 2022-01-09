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
import React from 'react'
import { ROUTES } from '../../navigation'
import { MainDrawerItem } from './MainDrawerItem'

const drawerWidth = 240

export const MainDrawer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <MainDrawerItem
            itemType="dashboard"
            label="Dashboard"
            route={ROUTES.dashboard}
          />
          <MainDrawerItem
            itemType="dailyEntries"
            label="Daily Entries"
            route={ROUTES.dailyEntries}
          />
          <MainDrawerItem
            itemType="register"
            label="Registration"
            route={ROUTES.register}
          />
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={'Settings'} />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}
