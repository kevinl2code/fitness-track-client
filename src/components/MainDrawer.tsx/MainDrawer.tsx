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
import { useNavigate } from 'react-router-dom'
import { Mail as MailIcon, Inbox as InboxIcon } from '@mui/icons-material'
import React from 'react'
import { ROUTES } from '../../navigation'

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
          <ListItem button onClick={() => navigate(ROUTES.dashboard)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={'Dashboard'} />
          </ListItem>
          <ListItem button onClick={() => navigate(ROUTES.dailyEntries)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={'Daily Entries'} />
          </ListItem>
          <ListItem button onClick={() => navigate(ROUTES.register)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={'Registration'} />
          </ListItem>
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
