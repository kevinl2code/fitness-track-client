import { LinearProgress, Grid } from '@mui/material'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { CycleContext, UserContext } from '../../app/App'
import { DashboardEntriesPanel } from '../../components/DashboardEntriesPanel'
import { DashboardGoalPanel } from '../../components/DashboardGoalPanel'
import { NewUserDialog } from '../../components/dialogs/NewUserDialog'
import { Cycle, DailyEntry } from '../../model/Model'
import { UseApi } from './UseApi'

interface Props {
  setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
}

export const DashboardPage: React.FC<Props> = ({ setCycleContext }) => {
  const [entries, setEntries] = useState<DailyEntry[] | null>(null)
  const [openNewUserDialog, setOpenNewUserDialog] = React.useState(false)
  const [loading, setLoading] = useState(true)
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
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
        <Grid container>
          <Grid item xs={4}>
            {cycle && (
              <DashboardGoalPanel
                cycleType={cycle?.cycleType!}
                duration={cycle?.duration!}
                goalWeight={cycle?.goalWeight!}
                startDate={cycle?.startDate!}
                startingWeight={cycle?.startingWeight!}
              />
            )}
          </Grid>
          <Grid item xs={8}>
            {entries ? (
              <DashboardEntriesPanel entries={entries} />
            ) : (
              <h1>No entries</h1>
            )}
          </Grid>
        </Grid>
      )}
    </>
  )
}
