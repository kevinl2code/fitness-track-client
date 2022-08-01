import { Grid } from '@mui/material'
import React, { useContext } from 'react'
import { DashboardWeightTrackerChart } from '../../components/DashboardWeightTrackerChart'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
import { DashboardInsufficientData } from '../../components/DashboardInsufficientData/DashboardInsufficientData'
import { OverviewCalorieChart } from '../../components/OverviewCalorieChart'
import { Sort } from '../../utilities/Sort'
import { DailyEntry } from '../../model/Model'
import { OverviewProgressSummary } from '../../components/OverviewProgressSummary'
import { useStore } from '../../store/useStore'
import { useUserStore } from '../../store/useUserStore'

export const DashboardPage: React.FC = () => {
  const { userData } = useUserStore()
  const { entries } = useStore((state) => state.entriesSlice)
  const { selectedCycle } = useStore((state) => state.selectedCycleSlice)
  const minimumEntries = 4
  const currentEntries = entries.length
  const daysRemaining = minimumEntries - currentEntries
  const cycleHasMinimumEntries = currentEntries >= minimumEntries
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries)

  return (
    <>
      {cycleHasMinimumEntries ? (
        <Grid container sx={{ width: '100%' }}>
          <Grid item xs={12} container justifyContent="flex-end">
            <OverviewProgressSummary
              entries={sortedEntries}
              cycle={selectedCycle}
            />
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <DashboardWeightTrackerChart
              entries={sortedEntries}
              user={userData!}
            />
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <OverviewCalorieChart entries={entries} />
          </Grid>
          <Grid item xs={12}>
            <DashboardEntriesPanel entries={entries} user={userData!} />
          </Grid>
        </Grid>
      ) : (
        <DashboardInsufficientData daysRemaining={daysRemaining} />
      )}
    </>
  )
}
