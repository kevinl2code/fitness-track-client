import { Button, Grid } from '@mui/material'
import React from 'react'
import { QueryClient, useMutation, useQueryClient } from 'react-query'
import { Cycle, DailyEntry } from '../../../model/Model'
import { DataService } from '../../../services/DataService'

interface Props {
  cycle: Cycle
  finalEntry: DailyEntry
  dataService: DataService
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export const ReturningUserDialogLongHiatusView: React.FC<Props> = ({
  cycle,
  finalEntry,
  dataService,
  setDialogOpenState,
}) => {
  const queryClient = useQueryClient()
  const { mutate: closeActiveCycle, isLoading } = useMutation(
    (updatedCycle: Cycle) => dataService.updateUserCycle(updatedCycle)
  )

  const updatedCycle: Cycle = {
    ...cycle,
    endingDate: finalEntry.entryDate,
    endingWeight: finalEntry.dailyEntryWeight,
    isActive: false,
  }

  const handleGetStarted = () => {
    closeActiveCycle(updatedCycle, {
      onSuccess: async () => {
        await queryClient.refetchQueries(['cycles'])
        setDialogOpenState(false)
      },
    })
  }

  return (
    <Grid>
      <Button onClick={handleGetStarted}>Get Started</Button>
    </Grid>
  )
}
