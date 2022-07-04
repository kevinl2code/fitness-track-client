import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import { Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../navigation'

const nameMap: {
  [key: string]: string
} = {
  '/app/profile': 'Profile',
  '/app/faq': 'FAQ',
  '/app/appSettings': 'Settings',
  '/app/termsAndConditions': 'Terms of Use',
}

export const MorePagesBackNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const headingText = nameMap[location.pathname]
  return (
    <Grid
      container
      justifyContent="flex-start"
      alignItems="center"
      sx={[
        {
          width: '100%',
          height: '60px',
          backgroundColor: 'white',
          border: 'none',
          position: 'sticky',
          top: -1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        },
      ]}
    >
      <Grid item xs={3}>
        <Button
          startIcon={
            <NavigateBeforeIcon
              fontSize="large"
              sx={{ color: 'primary.main' }}
            />
          }
          onClick={() => navigate(`../${ROUTES.more}`)}
        >
          More
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Typography color={'primary.main'} variant="h5" textAlign="center">
          {headingText}
        </Typography>
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  )
}
