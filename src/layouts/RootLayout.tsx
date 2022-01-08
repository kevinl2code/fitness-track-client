import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { MainAppBar } from '../components/MainAppBar/MainAppBar'
import { MainDrawer } from '../components/MainDrawer.tsx/MainDrawer'

export const RootLayout: React.FC = ({ children }) => {
  return (
    <Container maxWidth={false} disableGutters={true} sx={{ display: 'flex' }}>
      <MainAppBar />
      <MainDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3, padding: '1rem' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Container>
  )
}
