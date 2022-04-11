import { Box, Container, Grid } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQueries } from '../utilities/useMediaQueries'

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

const ftlogo = `${process.env.PUBLIC_URL}/logoBlueText.svg`

export const PublicLayout: React.FC = () => {
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
          backgroundColor: '#f0f4f7',
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
            height: '50vh',
            // flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
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
            top: '5%',
            // left: '15%',
          }}
          alt="Fitness Track logo"
        />
      </Box>
      <Box
        component="main"
        sx={[{ width: '100%', p: 3, padding: '1rem', minHeight: '50vh' }]}
      >
        <Outlet />
      </Box>
    </Container>
  )
}
