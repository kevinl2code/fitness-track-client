import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
} from '@mui/material'
import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form'

interface Props {
  activeStep: number
  register: UseFormRegister<FieldValues>
  control: Control<FieldValues, object>
  values: {
    [x: string]: any
  }
}

export const NewUserDialogForm: React.FC<Props> = ({
  activeStep,
  register,
  control,
  values,
}) => {
  const reviewText = () => {
    if (values.goalWeight < values.currentWeight) {
      return `Based on what you've entered, you want to lose ${
        values.currentWeight - values.goalWeight
      } lbs over the course of ${values.timeFrame} days.`
    }
    if (values.goalWeight > values.currentWeight) {
      return `Based on what you've entered, you want to gain ${
        values.goalWeight - values.currentWeight
      } lbs over the course of ${values.timeFrame} days.`
    }
    if (values.goalWeight === values.currentWeight) {
      return `Based on what you've entered, you want to maintain your current weight over the course of ${values.timeFrame} days.`
    }
  }

  const stepOne = activeStep === 0 && (
    <>
      <Grid item xs={6}>
        <Typography>My current weight is...</Typography>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="currentWeight"
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
                helperText={invalid && 'Weight is out olf range.'}
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
          rules={{ min: 50, max: 600 }}
        />
      </Grid>
    </>
  )

  const stepTwo = activeStep === 1 && (
    <>
      <Grid item xs={6}>
        <Typography>My goal weight is...</Typography>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="goalWeight"
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
                helperText={invalid && 'Weight is out of range.'}
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
          rules={{
            min: 50,
            max: 600,
          }}
        />
      </Grid>
    </>
  )

  const stepThree = activeStep === 2 && (
    <>
      <Grid item xs={6}>
        <Typography>I hope to accomplish this in...</Typography>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name="timeFrame"
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
                helperText={invalid && 'Weight must be greater than 50 lbs'}
                sx={{ minWidth: '100%' }}
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">days</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          )}
          rules={{
            min: 7,
          }}
        />
      </Grid>
    </>
  )

  const stepFour = activeStep === 3 && (
    <>
      <Grid item container xs={12} justifyContent="center">
        <Typography align="center" sx={{ width: '70%' }}>
          {reviewText()}
        </Typography>
      </Grid>
    </>
  )

  return (
    <Grid
      container
      sx={{ width: '100%' }}
      alignItems="flex-end"
      justifyContent="space-around"
    >
      {/* {activeStep === 0 && (
          <Controller
            name="intent"
            control={control}
            defaultValue="MAINTAIN"
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
                <MenuItem value={'MAINTAIN'}>
                  Maintain my current weight.
                </MenuItem>
                <MenuItem value={'CUT'}>Lose some weight</MenuItem>
                <MenuItem value={'BULK'}>Gain some weight</MenuItem>
              </Select>
            )}
          />
        )} */}
      {stepOne}
      {stepTwo}
      {stepThree}
      {stepFour}
      {/* {activeStep === 1 && (
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
                  helperText={invalid && 'Weight must be greater than 50 lbs'}
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
        )} */}
    </Grid>
  )
}
