import { CognitoUser } from '@aws-amplify/auth'
import { Box, Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { MainAppBar } from '../components/MainAppBar/MainAppBar'
import { MainDrawer } from '../components/MainDrawer/MainDrawer'

interface Props {
  setUser: React.Dispatch<React.SetStateAction<CognitoUser | null>>
}

export const AuthLayout: React.FC<Props> = ({ children, setUser }) => {
  return (
    <Container maxWidth={false} disableGutters={true} sx={{ display: 'flex' }}>
      <MainAppBar setUser={setUser} />
      <MainDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3, padding: '1rem' }}>
        <Outlet />
      </Box>
    </Container>
  )
}
