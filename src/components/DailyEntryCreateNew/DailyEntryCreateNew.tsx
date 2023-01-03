import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { ActivityLevel, Cycle, DailyEntry, UserState } from '../../model/Model'
import { AppLoadingPage } from '../../pages/AppLoadingPage'
import { dataService } from '../../app/App'
import { Calculate } from '../../utilities/Calculate'

interface IFormInput {
  weight: string
  activityLevel: ActivityLevel
}

interface Props {
  date: string
  daysRemaining: number
  user: UserState
  cycle: Cycle
}
//https://undraw.co/search
const indoorBike = `${process.env.PUBLIC_URL}/indoorbike.svg`
const workingOut = `${process.env.PUBLIC_URL}/workingout.svg`
const stabilityBall = `${process.env.PUBLIC_URL}/stabilityball.svg`
const personalTrainer = `${process.env.PUBLIC_URL}/personaltrainer.svg`
const images = [indoorBike, workingOut, stabilityBall, personalTrainer]

export const DailyEntryCreateNew: React.FC<Props> = ({
  date,
  daysRemaining,
  user,
  cycle,
  // refetchEntries,
}) => {
  const [imageIndex, setImageIndex] = useState(Math.floor(Math.random() * 4))
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm()

  const queryClient = useQueryClient()
  const calculate = new Calculate()
  const { birthday, sex, height, sub } = user
  const age = calculate.age(birthday)
  const isFirstDay = date === cycle?.startDate
  const weightDefaultValue = isFirstDay ? cycle.startingWeight : ''

  const { mutate: createNewDailyEntry, isLoading } = useMutation(
    (dailyEntry: DailyEntry) => dataService.createDailyEntry(dailyEntry),
    {
      onSuccess: async (data) => {
        await queryClient.refetchQueries(['dailyEntries'])
      },
    }
  )

  useEffect(() => {
    return () => {
      setValue('weight', weightDefaultValue)
    }
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const weight = parseFloat(data.weight)
    const poundsToGo = weight - cycle?.goalWeight
    const caloriesToGo = poundsToGo * 3500
    const deficitPerDay = caloriesToGo / daysRemaining
    const bmr = calculate.BMR(height, weight, age, sex)

    const tdee = calculate.TDEE(bmr, data.activityLevel)
    const targetCals = Math.round(tdee - deficitPerDay)
    const newDailyEntry: DailyEntry = {
      PK: sub,
      SK: date,
      GSI1PK: `C_${cycle?.cycleId!}`,
      GSI1SK: 'DAILYENTRIES',
      type: 'DAILYENTRY',
      dailyEntryWeight: weight,
      dailyEntryConsumables: [],
      dailyEntryActivityLevel: data.activityLevel,
      entryDate: date,
      autoGenerated: false,
      targetCalories: targetCals,
      cycleId: cycle?.cycleId!,
    }

    createNewDailyEntry(newDailyEntry)
  }

  const selectedImage = images[imageIndex]
  const formHeaderSubText = {
    CUT: 'lose some weight',
    BULK: 'gain some weight',
    MAINTAIN: 'maintain your weight',
  }

  const formHeaderText = {
    firstDay: `Today marks the first day of your plan to ${
      formHeaderSubText[cycle?.cycleType!]
    }.  Set your activity level to get started!`,
    standard: 'Get the day started by setting your weight and activity level!',
  }

  if (isLoading) {
    return <AppLoadingPage color={'#fff'} />
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ marginTop: '2rem' }}
      >
        <Typography
          textAlign="center"
          variant="h6"
          sx={{ color: 'primary.main', fontWeight: 700, marginBottom: '1rem' }}
        >
          {isFirstDay ? formHeaderText.firstDay : formHeaderText.standard}
        </Typography>
        <img
          src={selectedImage}
          alt="People being active"
          style={{ width: '50%', height: 'auto' }}
        />
      </Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="space-evenly">
          <Grid item>
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              sx={{ padding: '2rem 0 2rem 0' }}
            >
              <Grid item>
                <Controller
                  name="weight"
                  control={control}
                  defaultValue={weightDefaultValue}
                  render={({
                    field,
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <FormControl sx={{ width: '9ch' }}>
                      <TextField
                        {...field}
                        error={invalid}
                        disabled={isFirstDay}
                        // value={isFirstDay ? cycle.startingWeight : field.value}
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
              <Grid item>Weight</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              sx={{ padding: '2rem 0 2rem 0' }}
            >
              <Grid item>
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
              <Grid item>Acivity Level</Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Button variant="contained" type="submit" sx={{ marginTop: '1rem' }}>
            Submit
          </Button>
        </Grid>
      </form>
    </>
  )
}
