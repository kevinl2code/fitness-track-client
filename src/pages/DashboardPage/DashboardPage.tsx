import React from 'react'
import { DashboardWeightTrackerChart } from '../../components/DashboardWeightTrackerChart'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
import { DashboardInsufficientData } from '../../components/DashboardInsufficientData/DashboardInsufficientData'
import { OverviewCalorieChart } from '../../components/OverviewCalorieChart'
import { Sort } from '../../utilities/Sort'
import { DailyEntry } from '../../model/Model'
import { OverviewProgressSummary } from '../../components/OverviewProgressSummary'
import { useStore } from '../../store/useStore'
import { PageLayout } from '../../layouts/PageLayout'

export const DashboardPage: React.FC = () => {
  const { userData } = useStore((state) => state.userSlice)
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
        <PageLayout>
          <PageLayout.Content>
            <OverviewProgressSummary
              entries={sortedEntries}
              cycle={selectedCycle}
            />
            <DashboardWeightTrackerChart
              entries={sortedEntries}
              user={userData!}
            />
            <OverviewCalorieChart entries={entries} />
            <DashboardEntriesPanel entries={entries} user={userData!} />
          </PageLayout.Content>
        </PageLayout>
      ) : (
        <DashboardInsufficientData daysRemaining={daysRemaining} />
      )}
    </>
  )
}
