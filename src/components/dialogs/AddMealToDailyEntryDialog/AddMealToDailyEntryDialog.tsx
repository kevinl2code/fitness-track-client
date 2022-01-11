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

export const AddMealToDailyEntryDialog: React.FC<Props> = ({
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
      const result = await dataservice.updateDailyEntryMeals(
        entry.dailyEntryId,
        [...entry.meals, data]
      )
      console.log(result)
      handleClose()
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error adding meal: ${error.message}`)
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
      <DialogTitle>Add Meal</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {`Add a meal to daily entry for ${entry?.date}`}
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
              <Grid item xs={8}>
                Meal Name
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={''}
                  render={({
                    field,
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <FormControl>
                      <TextField
                        {...field}
                        error={invalid}
                        helperText={invalid && 'Meal must have a name'}
                        sx={{ minWidth: '100%' }}
                        variant="standard"
                      />
                    </FormControl>
                  )}
                  rules={{ required: true }}
                />
              </Grid>
            </Grid>
            <Divider variant="middle" sx={{ minWidth: '100%' }} />
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
              <Grid item xs={8}>
                Calories
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="calories"
                  control={control}
                  defaultValue={0}
                  render={({
                    field,
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <FormControl>
                      <TextField
                        {...field}
                        error={invalid}
                        helperText={
                          invalid && 'Meal must have at least 1 calorie'
                        }
                        sx={{ minWidth: '100%' }}
                        variant="standard"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">cal</InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  )}
                  rules={{ min: 1 }}
                />
              </Grid>
            </Grid>
            <Divider variant="middle" sx={{ minWidth: '100%' }} />
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
              <Grid item xs={8}>
                Protein
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="protein"
                  control={control}
                  defaultValue={0}
                  render={({
                    field,
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <FormControl>
                      <TextField
                        {...field}
                        error={invalid}
                        sx={{ minWidth: '100%' }}
                        variant="standard"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              grams
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
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
