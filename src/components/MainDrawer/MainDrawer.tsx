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
import { Mail as MailIcon } from '@mui/icons-material'
import React from 'react'
import { ROUTES } from '../../navigation'
import { MainDrawerItem } from './MainDrawerItem'

const drawerWidth = 240

export const MainDrawer: React.FC = () => {
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
          <MainDrawerItem itemType="foods" label="Foods" route={ROUTES.foods} />
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
