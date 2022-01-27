import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQueries } from '../utilities/useMediaQueries'

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

export const PublicLayout: React.FC = () => {
  const ftlogo = `${process.env.PUBLIC_URL}/ftlogo.png`
  const { matchesMD } = useMediaQueries()
  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      component="div"
      sx={[
        {
          display: 'flex',
          alignItems: 'stretch',
          minHeight: '100vh',
        },
        !matchesMD && {
          flexDirection: 'column',
        },
      ]}
    >
      <Box
        component="div"
        sx={[
          {
            width: '50%',
            backgroundColor: 'primary.main',
            flexGrow: 1,
            display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'center',
          },
          !matchesMD && {
            width: '100%',
          },
        ]}
      >
        <img
          src={ftlogo}
          style={{
            width: vh * 0.4,
            height: vh * 0.4,
            overflow: 'hidden',
            position: 'sticky',
            top: '25%',
            left: '15%',
          }}
          alt="Fitness Track logo"
        />
      </Box>
      <Box
        component="main"
        sx={[
          { width: '50%', p: 3, padding: '1rem' },
          !matchesMD && {
            width: '100%',
          },
        ]}
      >
        <Outlet />
      </Box>
    </Container>
  )
}
