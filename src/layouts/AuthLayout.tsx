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
  const { matchesMD } = useMediaQueries()

  return (
    <Container sx={{ display: 'flex' }} disableGutters={!matchesMD}>
      <MainAppBar setAppUser={setAppUser} />
      {/* <MainDrawer /> */}
      <Box
        component="main"
        sx={[
          { flexGrow: 1, width: '100%' },
          matchesMD && {
            padding: '1rem',
          },
        ]}
      >
        <Toolbar variant="dense" />
        <Outlet />
        {!matchesMD && <Toolbar />}
      </Box>
      {!matchesMD && <MainBottomNavigation />}
    </Container>
  )
}
