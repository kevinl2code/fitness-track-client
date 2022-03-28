import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { MainBottomNavigation } from '../components/MainBottomNavigation'
import { User } from '../model/Model'

interface Props {
  setAppUser: (user: User | null) => Promise<void>
}

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

export const AuthLayout: React.FC<Props> = ({ children, setAppUser }) => {
  return (
    <Container sx={{ display: 'flex', height: vh }} disableGutters={true}>
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Outlet />
        <Toolbar />
      </Box>

      <MainBottomNavigation />
    </Container>
  )
}
