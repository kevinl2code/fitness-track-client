import { Box, Container, Grid, LinearProgress } from '@mui/material'
import React from 'react'
import { useMediaQueries } from '../../utilities/useMediaQueries'

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

export const AppLoadingPage: React.FC = () => {
  const ftlogo = `${process.env.PUBLIC_URL}/ftlogo.png`
  const { matchesMD } = useMediaQueries()
  const contentHeight = vh * 0.75
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
          backgroundColor: 'primary.main',
        },
        !matchesMD && {
          flexDirection: 'column',
        },
      ]}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ height: contentHeight }}
      >
        <Grid item>
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
        </Grid>
        <Box sx={{ width: '50%' }}>
          <LinearProgress />
        </Box>
      </Grid>
    </Container>
  )
}
