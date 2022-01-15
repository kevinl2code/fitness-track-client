import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const PublicLayout: React.FC = ({ children }) => {
  return (
    <Container maxWidth={false} disableGutters={true} sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, padding: '1rem' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Container>
  )
}
