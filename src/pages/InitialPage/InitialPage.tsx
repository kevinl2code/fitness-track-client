import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../navigation'

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

export const InitialPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      spacing={2}
      sx={{ minHeight: '40vh', padding: '2rem' }}
    >
      <Grid item sx={{ width: '100%' }}>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          onClick={() => navigate(`../${ROUTES.login}`)}
        >
          Sign In
        </Button>
      </Grid>
      <Grid item sx={{ width: '100%' }}>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          onClick={() => navigate(`../${ROUTES.register}`)}
        >
          Sign Up
        </Button>
      </Grid>
    </Grid>
  )
}
