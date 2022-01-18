import { AccountCircle } from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  TextField,
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { UserState } from '../../../model/Model'
import { AuthService } from '../../../services/AuthService'
import { TextInput } from '../../form/TextInput'
import { NewUserDialogForm } from './NewUserDialogForm'

interface Props {
  open: boolean
  user: UserState
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFormInput {
  username: string
  code: string
}

const steps = ['Current Weight', 'Goal Weight', 'Timeframe', 'Review']
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)
const dialogHeight = vh * 0.5

export const NewUserDialog: React.FC<Props> = ({
  open,
  user,
  setDialogOpenState,
}) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set<number>())
  const {
    reset,
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({ mode: 'onBlur' })
  const authService = new AuthService()
  const navigate = useNavigate()

  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data: any) => {
    console.log(data)
  }
  const values = getValues()

  console.log(values)

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      fullWidth
      // sx={{ height: dialogHeight }}
    >
      <DialogTitle
        sx={{ textAlign: 'center' }}
      >{`Welcome ${user.firstName}`}</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText></DialogContentText>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {}

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ marginTop: '2rem' }}
              >
                <NewUserDialogForm
                  activeStep={activeStep}
                  register={register}
                  control={control}
                  values={values}
                />
              </form>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
