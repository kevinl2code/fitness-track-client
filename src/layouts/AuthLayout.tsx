import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { MainAppBar } from '../components/MainAppBar/MainAppBar'
import { MainBottomNavigation } from '../components/MainBottomNavigation'
import { User } from '../model/Model'
import { useMediaQueries } from '../utilities/useMediaQueries'

interface Props {
  setAppUser: (user: User | null) => Promise<void>
}

export const AuthLayout: React.FC<Props> = ({ children, setAppUser }) => {
  return (
    <Container sx={{ display: 'flex' }} disableGutters={true}>
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Outlet />
        <Toolbar />
      </Box>
      <MainBottomNavigation />
    </Container>
  )
}
