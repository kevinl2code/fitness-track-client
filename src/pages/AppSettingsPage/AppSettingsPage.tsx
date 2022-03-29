import { Card, CardContent, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import { MorePagesBackNavigation } from '../../components/MorePagesBackNavigation'

export const AppSettingsPage: React.FC = () => {
  return (
    <>
      <Grid container justifyContent="center">
        <MorePagesBackNavigation />
      </Grid>
      <Container>
        <Grid container direction="column" alignItems="center" rowSpacing={2}>
          <Grid item sx={{ width: '100%' }}>
            <DisplayCard subject="Measurement Units" value="Metric" />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <DisplayCard subject="Display Plan" value="Current" />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <DisplayCard subject="Account Type" value="Free with Ads" />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

interface DisplayCardProps {
  subject: string
  value: string | undefined
}

const DisplayCard: React.FC<DisplayCardProps> = ({ subject, value }) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Grid item container>
          <Grid item xs={6}>
            <Typography textAlign="left">{`${subject}:`}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography textAlign="right">{`${value}`}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
