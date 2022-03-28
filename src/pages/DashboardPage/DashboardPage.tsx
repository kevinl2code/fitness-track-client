import { Grid } from '@mui/material'
import React, { useContext } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { DashboardWeightTrackerChart } from '../../components/DashboardWeightTrackerChart'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { DashboardInsufficientData } from '../../components/DashboardInsufficientData/DashboardInsufficientData'
import { OverviewCalorieChart } from '../../components/OverviewCalorieChart'
import { Sort } from '../../utilities/Sort'
import { DailyEntry } from '../../model/Model'

export const DashboardPage: React.FC = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const minimumEntries = 4
  const currentEntries = entries.length
  const daysRemaining = minimumEntries - currentEntries
  const cycleHasMinimumEntries = currentEntries >= minimumEntries
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries!)

  return (
    <>
      {cycleHasMinimumEntries ? (
        <Grid container sx={{ width: '100%' }}>
          <Grid
            item
            xs={12}
            md={8}
            container
            justifyContent="flex-end"
            // sx={{ margin: '0 8px 0 8px' }}
          >
            <DashboardWeightTrackerChart entries={sortedEntries} user={user!} />
          </Grid>
          <Grid item xs={12} md={8} container justifyContent="flex-end">
            <OverviewCalorieChart entries={entries} />
          </Grid>
          <Grid item xs={12}>
            <DashboardEntriesPanel entries={entries} user={user!} />
          </Grid>
        </Grid>
      ) : (
        <DashboardInsufficientData daysRemaining={daysRemaining} />
      )}
    </>
  )
}
