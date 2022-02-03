import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { UseApi } from '../../pages/DailyEntriesPage/UseApi'
import { ActivityLevel, Cycle, DailyEntry } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { palette } from '@mui/system'

interface IFormInput {
  weight: number
  activityLevel: ActivityLevel
}

interface Props {
  date: string
  sub: string
  cycle: Cycle | null
  useApi: UseApi
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
}
//https://undraw.co/search
const indoorBike = `${process.env.PUBLIC_URL}/indoorbike.svg`
const workingOut = `${process.env.PUBLIC_URL}/workingout.svg`
const stabilityBall = `${process.env.PUBLIC_URL}/stabilityball.svg`
const personalTrainer = `${process.env.PUBLIC_URL}/personaltrainer.svg`
const images = [indoorBike, workingOut, stabilityBall, personalTrainer]

export const DailyEntryCreateNew: React.FC<Props> = ({
  date,
  useApi,
  sub,
  cycle,
  setLoading,
  setDailyEntry,
}) => {
  const [imageIndex, setImageIndex] = useState(Math.floor(Math.random() * 4))
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm()
  const { matchesMD } = useMediaQueries()
  const isFirstDay = date === cycle?.startDate
  const weightDefaultValue = isFirstDay ? cycle.startingWeight : 0
  useEffect(() => {
    setValue('weight', weightDefaultValue)
  }, [date, setValue, weightDefaultValue])
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newDailyEntry: DailyEntry = {
      PK: sub,
      SK: 'DAILYENTRY',
      GSI1PK: `C_${cycle?.cycleId!}`,
      GSI1SK: date,
      type: 'DAILYENTRY',
      dailyEntryWeight: data.weight,
      dailyEntryMeals: [],
      dailyEntryActivityLevel: data.activityLevel,
      entryDate: date,
      cycleId: cycle?.cycleId!,
    }
    await useApi.createNewDailyEntry(newDailyEntry)
    useApi.fetchPageData(setLoading, setDailyEntry)
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

  return (
    <>
      <Grid container direction="column" alignItems="center">
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
              sx={[
                { padding: '2rem' },
                !matchesMD && { padding: '2rem 0 2rem 0' },
              ]}
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
              sx={[
                { padding: '2rem' },
                !matchesMD && { padding: '2rem 0 2rem 0' },
              ]}
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
