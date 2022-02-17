import { LinearProgress, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { CycleContext, UserContext } from '../../app/App'
import { DashboardWeightTrackerChart } from '../../components/DashboardWeightTrackerChart'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
// import { DashboardSummaryCard } from '../../components/DashboardSummaryCard'
import { NewUserDialog } from '../../components/dialogs/NewUserDialog'
import { Cycle, DailyEntry } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { DataService } from '../../services/DataService'
import { useQuery } from 'react-query'

interface Props {
  setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
}

const workingOut = `${process.env.PUBLIC_URL}/workingout.svg`

export const DashboardPage: React.FC<Props> = ({ setCycleContext }) => {
  const [entries, setEntries] = useState<DailyEntry[] | null>(null)
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const { matchesMD } = useMediaQueries()

  const dataService = new DataService()

  dataService.setUser(user?.user!)

  // const { isLoading: cyclesLoading, data: fetchedCycles } = useQuery(
  //   'cycles',
  //   () => dataService.getUserCycles(user?.sub!),
  //   {
  //     onSuccess: (data) => {
  //       const currentlyActiveCycle = data?.find((cycle) => {
  //         return cycle.isActive === true
  //       })

  //       if (currentlyActiveCycle) {
  //         setCycleContext(currentlyActiveCycle)
  //       } else {
  //         setOpenNewUserDialog(true)
  //       }
  //     },
  //   }
  // )

  const { isLoading: dailyEntriesLoading, data: fetchedDailyEntries } =
    useQuery(
      ['dailyEntries'],
      () => dataService.getDailyEntriesForCycle(cycle?.cycleId!),
      {
        enabled: !!cycle,
        onSuccess: (data) => {
          if (data && data.length > 0) {
            setEntries(data)
          }
        },
      }
    )

  return (
    <>
      {/* {dailyEntriesLoading || cyclesLoading ? ( */}
      {dailyEntriesLoading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {!cycle || !entries ? (
            <Grid item container justifyContent="center" alignItems="center">
              <img
                src={workingOut}
                alt="People being active"
                style={{ width: '50%', height: 'auto' }}
              />
            </Grid>
          ) : (
            <>
              {/* {matchesMD && (
                <Grid item xs={12} md={4}>
                  <DashboardSummaryCard
                    cycleType={cycle?.cycleType!}
                    duration={cycle?.duration!}
                    goalWeight={cycle?.goalWeight!}
                    entries={entries}
                    startDate={cycle?.startDate!}
                    startingWeight={cycle?.startingWeight!}
                  />
                </Grid>
              )} */}
              <Grid item xs={12} md={8} container justifyContent="flex-end">
                <DashboardWeightTrackerChart entries={entries} user={user!} />
              </Grid>
              <Grid item xs={12}>
                <DashboardEntriesPanel entries={entries} user={user!} />
              </Grid>
            </>
          )}
        </Grid>
      )}
    </>
  )
}
