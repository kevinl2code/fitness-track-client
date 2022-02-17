import { Grid } from '@mui/material'
import React, { useContext } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { DashboardWeightTrackerChart } from '../../components/DashboardWeightTrackerChart'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
// import { DashboardSummaryCard } from '../../components/DashboardSummaryCard'

import { useMediaQueries } from '../../utilities/useMediaQueries'
import { DataService } from '../../services/DataService'

export const DashboardPage: React.FC = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const { matchesMD } = useMediaQueries()

  const dataService = new DataService()

  dataService.setUser(user?.user!)

  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      <Grid item xs={12} md={8} container justifyContent="flex-end">
        <DashboardWeightTrackerChart entries={entries} user={user!} />
      </Grid>
      <Grid item xs={12}>
        <DashboardEntriesPanel entries={entries} user={user!} />
      </Grid>
    </Grid>
  )
}
