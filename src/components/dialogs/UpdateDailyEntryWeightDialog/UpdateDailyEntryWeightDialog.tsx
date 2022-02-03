import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
} from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { DailyEntry, EntryMeal } from '../../../model/Model'
import { UseApi } from '../../../pages/DailyEntriesPage/UseApi'

interface Props {
  entry: DailyEntry
  useApi: UseApi
  open: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateDailyEntryWeightDialog: React.FC<Props> = ({
  entry,
  useApi,
  open,
  setDialogOpenState,
}) => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const onSubmit: SubmitHandler<EntryMeal> = async (data: any) => {
    if (typeof data === 'object' && 'weight' in data) {
      data.weight = parseInt(data?.weight)
    }
    useApi.updateWeight(data.weight)
    setDialogOpenState(false)
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Edit Weight</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {`Edit weight on  ${DateTime.fromISO(entry?.entryDate).toFormat(
            'MMM dd, yyyy'
          )}`}
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
              <Grid item xs={8}>
                Weight
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="weight"
                  control={control}
                  defaultValue={entry?.dailyEntryWeight}
                  render={({
                    field,
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <FormControl>
                      <TextField
                        {...field}
                        error={invalid}
                        helperText={
                          invalid && 'Weight must be greater than 50 lbs'
                        }
                        sx={{ minWidth: '100%' }}
                        variant="standard"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">lbs</InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  )}
                  rules={{ min: 50 }}
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
