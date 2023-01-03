import { yupResolver } from '@hookform/resolvers/yup'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  InputAdornment,
  DialogActions,
  Button,
} from '@mui/material'
import { DateTime } from 'luxon'
import { useMutation, useQueryClient } from 'react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Cycle, DailyEntry, UserState } from '../../../model/Model'
import { Calculate } from '../../../utilities/Calculate'
import * as yup from 'yup'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { dataService } from '../../../app/App'
import { useEffect } from 'react'

interface IFormInput {
  goalWeight: string
}

interface Props {
  entry: DailyEntry | null
  cycle: Cycle
  user: UserState
  open: boolean
  mutableCycleParams: {
    endingDate: string
    goalWeight: number
  }
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
  setMutableCycleParams: React.Dispatch<
    React.SetStateAction<{
      endingDate: string
      goalWeight: number
    }>
  >
}

export const UpdateGoalWeightDialog: React.FC<Props> = ({
  entry,
  cycle,
  mutableCycleParams,
  user,
  open,
  setDialogOpenState,
  setMutableCycleParams,
}) => {
  const queryClient = useQueryClient()
  const calculate = new Calculate()
  const currentGoal = cycle.goalWeight
  const maxGoalWeight =
    currentGoal + 10 < cycle.startingWeight - 1
      ? currentGoal + 10
      : cycle.startingWeight - 1
  const planDuration = calculate.planDuration(cycle.startDate, cycle.endingDate)

  const validationSchema = yup.object({
    goalWeight: yup
      .number()
      .typeError('Value for weight is required')
      .min(currentGoal - 10, ({ min }) => `Must be ${min} lbs or more`)
      .max(maxGoalWeight, ({ max }) => `Must be ${max} lbs or less`)
      .required('Value for weight is required'),
  })
  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({ mode: 'onTouched', resolver: yupResolver(validationSchema) })

  useEffect(() => {
    setValue('goalWeight', mutableCycleParams.goalWeight)
  }, [cycle.goalWeight, setValue])

  const { mutate: updateDailyEntry, isLoading: updateDailyEntryIsLoading } =
    useMutation(
      (dailyEntry: DailyEntry) => dataService.updateDailyEntry(dailyEntry),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries('dailyEntries')
          setDialogOpenState(false)
        },
      }
    )
  const { mutate: updateCycle, isLoading: updateCycleIsLoading } = useMutation(
    (cycle: Cycle) => dataService.updateUserCycle(cycle),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('cycles')
        setDialogOpenState(false)
      },
    }
  )

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // if (entry) {
    //   const cycleStart = DateTime.fromISO(cycle?.startDate!)
    //   const entryDate = DateTime.fromISO(entry.entryDate)
    //   const daysSinceStart = Math.floor(entryDate.diff(cycleStart, 'days').days)
    //   const daysRemaining = planDuration - daysSinceStart
    //   const poundsToGo = entry.dailyEntryWeight - parseInt(data.goalWeight)
    //   const caloriesToGo = poundsToGo * 3500
    //   const deficitPerDay = caloriesToGo / daysRemaining
    //   const { birthday, sex, height } = user
    //   const age = calculate.age(birthday)
    //   const bmr = calculate.BMR(height, entry.dailyEntryWeight, age, sex)
    //   const tdee = calculate.TDEE(bmr, entry.dailyEntryActivityLevel)
    //   const targetCalories = Math.round(tdee - deficitPerDay)
    //   const updatedDailyEntry = {
    //     ...entry,
    //     targetCalories: targetCalories,
    //   }
    //   updateDailyEntry(updatedDailyEntry)
    // }
    // const updatedCycle = {
    //   ...cycle,
    //   goalWeight: parseInt(data.goalWeight),
    // }

    // updateCycle(updatedCycle)
    setMutableCycleParams({
      ...mutableCycleParams,
      goalWeight: parseInt(data.goalWeight),
    })
    setDialogOpenState(false)
    reset()
  }

  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const generateFormTextInput = ({
    name,
    control,
    label,
    placeholder,
    required,
    type,
    inputProps,
  }: FormTextInputProps) => {
    return (
      <Grid
        item
        xs={12}
        container
        direction={'column'}
        sx={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '1rem',
        }}
      >
        <FormTextInput
          control={control}
          label={label}
          required={required}
          type={type}
          name={name}
          placeholder={placeholder}
          inputProps={inputProps}
        />
      </Grid>
    )
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Goal Weight</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>{`Adjust your goal weight:`}</DialogContentText>
        <form>
          <Grid container justifyContent="center" sx={{ marginTop: '1rem' }}>
            <Grid item xs={6}>
              {generateFormTextInput({
                name: 'goalWeight',
                control: control,
                // placeholder: cycle.goalWeight.toString(),
                inputProps: {
                  endAdornment: (
                    <InputAdornment position="end">lbs</InputAdornment>
                  ),
                },
              })}
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
