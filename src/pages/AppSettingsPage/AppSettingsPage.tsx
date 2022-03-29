import { Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { MorePagesBackNavigation } from '../../components/MorePagesBackNavigation'

export const AppSettingsPage: React.FC = () => {
  return (
    <>
      <Grid container justifyContent="center">
        <MorePagesBackNavigation />
      </Grid>
      <Container>
        <Grid container direction="column" alignItems="center">
          <Grid container item>
            <Grid item xs={6}>
              <Typography>Measument Units</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Standard</Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={6}>
              <Typography>Display Plan</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Current</Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={6}>
              <Typography>Account Type</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>Free with Ads</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
