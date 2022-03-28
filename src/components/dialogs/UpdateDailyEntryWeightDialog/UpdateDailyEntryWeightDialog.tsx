import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { DailyEntry, UserState } from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { Calculate } from '../../../utilities/Calculate'

interface IFormInput {
  weight: string
}

interface Props {
  entry: DailyEntry
  goalWeight: number
  daysRemaining: number
  user: UserState
  dataService: DataService
  open: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

const validationSchema = yup.object({
  weight: yup
    .number()
    .typeError('Value for weight is required')
    .min(50, ({ min }) => `Must be ${min} lbs or more`)
    .max(1000, ({ max }) => `Must be ${max} lbs or less`)
    .required('Value for weight is required'),
})

export const UpdateDailyEntryWeightDialog: React.FC<Props> = ({
  entry,
  goalWeight,
  daysRemaining,
  user,
  dataService,
  open,
  setDialogOpenState,
}) => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onTouched', resolver: yupResolver(validationSchema) })

  const calculate = new Calculate()
  const queryClient = useQueryClient()
  const { birthday, sex, height, sub } = user

  const { dailyEntryActivityLevel } = entry || {}
  const age = calculate.age(birthday)
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
    const updatedWeight = Math.round(parseFloat(data.weight) * 10) / 10
    const poundsToGo = updatedWeight - goalWeight
    const caloriesToGo = poundsToGo * 3500
    const deficitPerDay = caloriesToGo / daysRemaining
    const bmr = calculate.BMR(height, updatedWeight, age, sex)
    const tdee = calculate.TDEE(bmr, dailyEntryActivityLevel)
    const targetCalories = Math.round(tdee - deficitPerDay)
    const updatedDailyEntry = {
      ...entry,
      dailyEntryWeight: updatedWeight,
      targetCalories: targetCalories,
    }
    updateDailyEntry(updatedDailyEntry)
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button type="submit">Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}
