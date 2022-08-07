import { Grid, Typography, InputAdornment } from '@mui/material'
import React from 'react'
import { Control, FieldValues, UseFormRegister } from 'react-hook-form'
import { FormTextInput } from '../../form/FormTextInput'

interface Props {
  activeStep: number
  control: Control<FieldValues, object>
  values: {
    [x: string]: any
  }
  hasErrors: boolean
}

export const NewUserDialogForm: React.FC<Props> = ({
  activeStep,
  control,
  values,
  hasErrors,
}) => {
  const currentWeight = parseFloat(values.startingWeight)
  const goalWeight = parseFloat(values.goalWeight)
  const reviewText = () => {
    if (goalWeight < currentWeight) {
      return `Based on what you've entered, you want to lose ${(
        currentWeight - goalWeight
      ).toFixed(1)} lbs over the course of ${values.duration} days.`
    }
    if (goalWeight > currentWeight) {
      return `Based on what you've entered, you want to gain ${(
        goalWeight - currentWeight
      ).toFixed(1)} lbs over the course of ${values.duration} days.`
    }
    if (goalWeight === currentWeight) {
      return `Based on what you've entered, you want to maintain your current weight over the course of ${values.duration} days.`
    }
  }

  const stepOne = activeStep === 0 && (
    <>
      <Grid item xs={6}>
        <Typography>My current weight is...</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormTextInput
          control={control}
          name="startingWeight"
          type="number"
          required={true}
          inputProps={{
            endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
          }}
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
        <FormTextInput
          control={control}
          name="goalWeight"
          type="number"
          required={true}
          inputProps={{
            endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
          }}
        />
      </Grid>
    </>
  )

  const stepThree = activeStep === 2 && (
    <>
      <Grid item xs={6}>
        <Typography>I hope to accomplish this in...</Typography>
        {}
      </Grid>
      <Grid item xs={6}>
        <FormTextInput
          control={control}
          name="duration"
          type="number"
          required={true}
          inputProps={{
            endAdornment: <InputAdornment position="end">days</InputAdornment>,
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
      alignItems={hasErrors ? 'center' : 'flex-end'}
      justifyContent="space-around"
    >
      {stepOne}
      {stepTwo}
      {stepThree}
      {stepFour}
    </Grid>
  )
}
