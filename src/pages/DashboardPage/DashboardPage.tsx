import { LinearProgress, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { CycleContext, UserContext } from '../../app/App'
import { DashboardWeightTrackerChart } from '../../components/DashboardWeightTrackerChart'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
import { DashboardSummaryCard } from '../../components/DashboardSummaryCard'
import { NewUserDialog } from '../../components/dialogs/NewUserDialog'
import { Cycle, DailyEntry } from '../../model/Model'
import { UseApi } from './UseApi'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
}

const workingOut = `${process.env.PUBLIC_URL}/workingout.svg`

export const DashboardPage: React.FC<Props> = ({ setCycleContext }) => {
  const [entries, setEntries] = useState<DailyEntry[] | null>(null)
  const [openNewUserDialog, setOpenNewUserDialog] = React.useState(false)
  const [loading, setLoading] = useState(true)
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const { matchesMD } = useMediaQueries()
  const useApi = new UseApi(
    user?.user!,
    user?.sub!,
    setEntries,
    setLoading,
    setOpenNewUserDialog,
    setCycleContext
  )

  useEffect(() => {
    useApi.fetchPageData()
  }, [])

  return (
    <>
      <NewUserDialog
        open={openNewUserDialog}
        user={user!}
        useApi={useApi}
        setDialogOpenState={setOpenNewUserDialog}
      />
      {loading ? (
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
              {matchesMD && (
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
              )}
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
