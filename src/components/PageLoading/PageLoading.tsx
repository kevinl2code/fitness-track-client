import {
  Box,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
} from '@mui/material'
import React from 'react'
import { useMediaQueries } from '../../utilities/useMediaQueries'

export const PageLoading: React.FC = () => {
  // return (
  //   <Grid container sx={{ height: '100%' }}>
  //     <CircularProgress />
  //   </Grid>
  // )

  const ftlogo = `${process.env.PUBLIC_URL}/ftlogo.png`
  const { matchesMD } = useMediaQueries()
  // const contentHeight = vh * 0.75
  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      component="div"
      sx={[
        {
          display: 'flex',
          alignItems: 'stretch',
          height: '100%',
          backgroundColor: '#fff',
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
        sx={{ height: '100%' }}
      >
        <Grid item>
          <img
            src={ftlogo}
            style={{
              width: '40%',
              height: '40%',
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
