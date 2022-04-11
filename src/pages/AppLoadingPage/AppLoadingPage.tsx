import { Box, Container, Grid, LinearProgress } from '@mui/material'
import React from 'react'
import { useMediaQueries } from '../../utilities/useMediaQueries'

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

interface Props {
  color: string
}

const ftlogo = `${process.env.PUBLIC_URL}/logoBlueText.svg`

export const AppLoadingPage: React.FC<Props> = ({ color }) => {
  const contentHeight = vh * 0.75
  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '100vh',
        backgroundColor: color,
        flexDirection: 'column',
      }}
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
