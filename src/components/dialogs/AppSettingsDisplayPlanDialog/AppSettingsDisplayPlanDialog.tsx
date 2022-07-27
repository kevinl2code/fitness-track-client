import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  Select,
  MenuItem,
  Button,
  DialogActions,
} from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useStore } from '../../../store/useStore'
import { Cycle } from '../../../model/Model'
import { useQueryClient } from 'react-query'

interface IFormInput {
  cycleId: string
}

interface Props {
  open: boolean
  selectedCycle: Cycle | null
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppSettingsDisplayPlanDialog: React.FC<Props> = ({
  open,
  selectedCycle,
  setDialogOpenState,
}) => {
  const { setSelectedCycle } = useStore((state) => state.selectedCycleSlice)
  const { cycleList } = useStore((state) => state.cycleListSlice)
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const queryClient = useQueryClient()
  const handleCloseDialog = () => {
    reset()
  }

  const formattedCycles = cycleList.map((cycle) => {
    if (cycle.isActive) {
      return {
        displayName: 'Current',
        value: cycle.cycleId,
      }
    }
    return {
      displayName: `${DateTime.fromISO(cycle.startDate).toFormat(
        'MMM dd'
      )} - ${DateTime.fromISO(cycle.endingDate).toFormat('MMM dd')}`,
      value: cycle.cycleId,
    }
  })

  const generateMenuItems = () => {
    return formattedCycles.map((formattedCycle, index) => {
      const { displayName, value } = formattedCycle
      return (
        <MenuItem value={value} key={`${index}-${value}`}>
          {displayName}
        </MenuItem>
      )
    })
  }
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const selectedCycle = cycleList.find((cycle) => {
      return cycle.cycleId === data.cycleId
    })
    // setDialogOpenState(false)
    setSelectedCycle(selectedCycle!)
    queryClient.refetchQueries(['dailyEntries']).then(() => {
      setDialogOpenState(false)
    })
  }

  // useEffect(() => {
  //   if (!allowOpen) {

  //   }
  // }, [allowOpen, setDialogOpenState])

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth>
      <DialogTitle>Set Plan to Display</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {'Select the current or a prior plan to display app wide'}
        </DialogContentText>
        <form>
          <Grid container justifyContent="center">
            <Grid
              item
              container
              alignItems="center"
              sx={{ padding: '2rem 0 2rem 0' }}
            >
              <Grid item md={8} xs={5}>
                Plan
              </Grid>
              <Grid item md={4} xs={7}>
                <Controller
                  name="cycleId"
                  control={control}
                  defaultValue={selectedCycle?.cycleId}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      {...register}
                      variant="standard"
                      value={value}
                      onChange={onChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      sx={{ minWidth: '100%' }}
                    >
                      {generateMenuItems()}
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
