import { Warning } from '@mui/icons-material'
import {
  Grid,
  Typography,
  InputAdornment,
  FormControl,
  TextField,
} from '@mui/material'
import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import EventIcon from '@mui/icons-material/Event'
import { FormTextInput } from '../../form/FormTextInput'

interface Props {
  activeStep: number
  control: Control<FieldValues, object>
  values: {
    [x: string]: any
  }

  hasErrors: boolean
}

export const NewCycleDialogForm: React.FC<Props> = ({
  activeStep,
  control,
  values,
  hasErrors,
}) => {
  const currentWeight = parseFloat(values.startingWeight)
  const goalWeight = parseFloat(values.goalWeight)
  // console.log({ currentWeight, goalWeight })
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
  const stepOne = activeStep >= 0 && (
    <StepperFormField
      name="startingWeight"
      control={control}
      label="Your current weight"
      placeholder="Your current weight"
      inputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MonitorWeightOutlinedIcon />
          </InputAdornment>
        ),
        endAdornment: <Typography style={{ opacity: 0.5 }}>lbs</Typography>,
      }}
    />
  )

  const stepTwo = activeStep >= 1 && (
    <StepperFormField
      name="goalWeight"
      control={control}
      label="Your goal weight"
      placeholder="Your goal weight"
      inputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MonitorWeightOutlinedIcon />
          </InputAdornment>
        ),
        endAdornment: <Typography style={{ opacity: 0.5 }}>lbs</Typography>,
      }}
    />
  )

  const stepThree = activeStep >= 2 && (
    <StepperFormField
      name="duration"
      control={control}
      label="How many days to reach goal"
      placeholder="Days to reach goal"
      inputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EventIcon />
          </InputAdornment>
        ),
        endAdornment: <Typography style={{ opacity: 0.5 }}>days</Typography>,
      }}
    />
  )

  const stepFour = activeStep === 3 && (
    <>
      <Grid item container xs={12} justifyContent="center">
        <Typography align="center" sx={{ width: '100%' }}>
          {reviewText()}
        </Typography>
      </Grid>
    </>
  )
  return (
    <Grid container direction="column" justifyContent="center">
      {stepOne}
      {stepTwo}
      {stepThree}
      {stepFour}
    </Grid>
  )
}

interface StepperFormFieldProps {
  name: string
  control: Control<FieldValues, object>
  label: string
  placeholder: string
  helperText?: string
  inputProps?: {
    [key: string]: any
  }
}

const StepperFormField: React.FC<StepperFormFieldProps> = ({
  name,
  control,
  label,
  placeholder,
  helperText,
  inputProps,
}) => {
  return (
    <Grid
      item
      container
      direction={'column'}
      sx={{
        paddingBottom: '1rem',
      }}
    >
      <FormTextInput
        control={control}
        label={label}
        name={name}
        placeholder={placeholder}
        helperText={helperText}
        InputProps={inputProps}
      />
    </Grid>
  )
}
