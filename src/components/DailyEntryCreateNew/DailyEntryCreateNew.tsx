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
import React, { useEffect } from 'react'
import { UseApi } from '../../pages/DailyEntriesPage/UseApi'
import { ActivityLevel, Cycle, DailyEntry } from '../../model/Model'

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

export const DailyEntryCreateNew: React.FC<Props> = ({
  date,
  useApi,
  sub,
  cycle,
  setLoading,
  setDailyEntry,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm()
  const isFirstDay = date === cycle?.startDate
  const weightDefaultValue = isFirstDay ? cycle.startingWeight : 0
  useEffect(() => {
    setValue('weight', weightDefaultValue)
  }, [date, setValue, weightDefaultValue])
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newDailyEntry: DailyEntry = {
      userId: sub,
      sortKey: date,
      dailyEntryWeight: data.weight,
      dailyEntryMeals: [],
      dailyEntryActivityLevel: data.activityLevel,
    }
    await useApi.createNewDailyEntry(newDailyEntry)
    useApi.fetchPageData(setLoading, setDailyEntry)
  }

  const formHeaderSubText = {
    CUT: 'lose some weight',
    BULK: 'gain some weight',
    MAINTAIN: 'maintain your weight',
  }
  console.log(cycle?.cycleType!)
  const formHeaderText = {
    firstDay: `Today marks the first day of your plan to ${
      formHeaderSubText[cycle?.cycleType!]
    }.  Since your starting weight was already entered, you will only need to set your activity level.`,
    standard:
      'No entries exist for this day. Get started by adding your weight and activity level.',
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>
          {isFirstDay ? formHeaderText.firstDay : formHeaderText.standard}
        </Typography>
      </CardContent>
      <Divider variant="middle" sx={{ minWidth: '85%' }} />
      <CardContent>
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
                  defaultValue={weightDefaultValue}
                  render={({
                    field,
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <FormControl>
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
            </Grid>
            <Divider variant="middle" sx={{ minWidth: '85%' }} />
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
              <Grid item xs={8}>
                Acivity Level
              </Grid>
              <Grid item xs={4}>
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
                      <MenuItem value={'SEDENTARY'}>SEDENTARY</MenuItem>
                      <MenuItem value={'LIGHTLY_ACTIVE'}>
                        LIGHTLY ACTIVE
                      </MenuItem>
                      <MenuItem value={'MODERATELY_ACTIVE'}>
                        MODERATELY ACTIVE
                      </MenuItem>
                      <MenuItem value={'VERY_ACTIVE'}>VERY ACTIVE</MenuItem>
                      <MenuItem value={'EXTRA_ACTIVE'}>EXTRA ACTIVE</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
