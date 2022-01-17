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
import React from 'react'
import { DataService } from '../../services/DataService'
import { UseApi } from '../../pages/DailyEntriesPage/UseApi'
import { DailyEntry } from '../../model/Model'

interface IFormInput {
  weight: number
  activityLevel: string
}

export interface ICreateDailyEntry {
  date: string
  weight: number
  activityLevel: string
  sub: string
  meals: []
}

interface Props {
  date: string
  sub: string
  useApi: UseApi
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setDailyEntry: React.Dispatch<React.SetStateAction<DailyEntry | null>>
}

export const DailyEntryCreateNew: React.FC<Props> = ({
  date,
  useApi,
  sub,
  setLoading,
  setDailyEntry,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // const dataservice = new DataService()
    const newDailyEntry: ICreateDailyEntry = {
      date: date,
      weight: data.weight,
      activityLevel: data.activityLevel,
      meals: [],
      sub: sub,
    }
    await useApi.createNewDailyEntry(newDailyEntry)
    useApi.fetchPageData(newDailyEntry.date!, setLoading, setDailyEntry)
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>
          No entries exist for this day. Get started by adding your weight and
          activity level.
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
