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
  Divider,
} from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ActivityLevel, DailyEntry } from '../../../model/Model'
import { useMutation, useQueryClient } from 'react-query'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'

interface IFormInput {
  activityLevel: ActivityLevel
}

interface Props {
  entry: DailyEntry
  dataService: DataService
  open: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateDailyEntryActivityLevelDialog: React.FC<Props> = ({
  entry,
  dataService,
  open,
  setDialogOpenState,
}) => {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const queryClient = useQueryClient()
  const { matchesMD } = useMediaQueries()
  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const { mutate: updateDailyEntry, isLoading } = useMutation(
    (dailyEntry: DailyEntry) => dataService.updateDailyEntry(dailyEntry),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('dailyEntries')
        setDialogOpenState(false)
        console.log({ mutationData: data })
      },
    }
  )

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const updatedDailyEntry = {
      ...entry,
      dailyEntryActivityLevel: data.activityLevel,
    }
    updateDailyEntry(updatedDailyEntry)
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth>
      <DialogTitle>Edit Activity</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {`Edit activity level on  ${DateTime.fromISO(
            entry?.entryDate
          ).toFormat('MMM dd, yyyy')}`}
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid
              item
              container
              alignItems="center"
              sx={[
                { padding: '2rem 0 2rem 0' },
                matchesMD && { padding: '2rem' },
              ]}
            >
              <Grid item md={8} xs={5}>
                Acivity Level
              </Grid>
              <Grid item md={4} xs={7}>
                <Controller
                  name="activityLevel"
                  control={control}
                  defaultValue="SEDENTARY"
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
                      <MenuItem value={'SEDENTARY'}>Sedentary</MenuItem>
                      <MenuItem value={'LIGHTLY_ACTIVE'}>
                        Lightly Active
                      </MenuItem>
                      <MenuItem value={'MODERATELY_ACTIVE'}>
                        Moderately Active
                      </MenuItem>
                      <MenuItem value={'VERY_ACTIVE'}>Very Active</MenuItem>
                      <MenuItem value={'EXTRA_ACTIVE'}>Extra Active</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
            <Divider variant="middle" sx={{ minWidth: '100%' }} />
          </Grid>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
