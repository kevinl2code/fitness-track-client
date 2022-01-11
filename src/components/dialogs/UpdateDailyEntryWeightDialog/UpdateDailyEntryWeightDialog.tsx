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
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { DailyEntry, Meal } from '../../../model/Model'
import { DataService } from '../../../services/DataService'

interface Props {
  entry: DailyEntry
  open: boolean
  handleClose: () => void
}

export const UpdateDailyEntryWeightDialog: React.FC<Props> = ({
  entry,
  open,
  handleClose,
}) => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<Meal> = async (data: any) => {
    const dataservice = new DataService()

    try {
      const result = await dataservice.updateDailyEntryWeight(
        entry.dailyEntryId,
        data.weight
      )
      console.log(result)
      handleClose()
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error updating weight: ${error.message}`)
      }
    }
  }

  useEffect(() => {
    if (open === false) {
      reset()
    }
  }, [open])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Weight</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText></DialogContentText>
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
                  defaultValue={entry?.weight}
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
