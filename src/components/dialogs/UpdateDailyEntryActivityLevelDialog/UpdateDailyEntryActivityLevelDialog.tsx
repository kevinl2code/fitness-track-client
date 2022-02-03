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
import { DailyEntry, EntryMeal } from '../../../model/Model'
import { UseApi } from '../../../pages/DailyEntriesPage/UseApi'
import { useMediaQueries } from '../../../utilities/useMediaQueries'

interface Props {
  entry: DailyEntry
  open: boolean
  useApi: UseApi
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateDailyEntryActivityLevelDialog: React.FC<Props> = ({
  entry,
  open,
  useApi,
  setDialogOpenState,
}) => {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { matchesMD } = useMediaQueries()
  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const onSubmit: SubmitHandler<Partial<EntryMeal>> = async (data: any) => {
    useApi.updateActivityLevel(data.activityLevel)
    setDialogOpenState(false)
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
