import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { MainAppBar } from '../components/MainAppBar/MainAppBar'
import { User } from '../model/Model'

interface Props {
  setAppUser: (user: User | null) => Promise<void>
}

export const AuthLayout: React.FC<Props> = ({ children, setAppUser }) => {
  return (
    <Container sx={{ display: 'flex' }}>
      <MainAppBar setAppUser={setAppUser} />
      {/* <MainDrawer /> */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, padding: '1rem', width: '100%' }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Container>
  )
}
