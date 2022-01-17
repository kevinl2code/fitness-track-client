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
} from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { UserState } from '../../../model/Model'
import { AuthService } from '../../../services/AuthService'
import { TextInput } from '../../form/TextInput'

interface Props {
  open: boolean
  user: UserState
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFormInput {
  username: string
  code: string
}

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad']

export const NewUserDialog: React.FC<Props> = ({
  open,
  user,
  setDialogOpenState,
}) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set<number>())
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const authService = new AuthService()
  const navigate = useNavigate()

  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const isStepOptional = (step: number) => {
    return step === 1
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data: any) => {
    const result = await authService.confirmSignUp(data.username, data.code)
    if (result) {
      reset()
      setDialogOpenState(false)
      navigate('/')
    } else {
      console.log('Confirmation failed. Please check your credentials')
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle
        sx={{ textAlign: 'center' }}
      >{`Welcome ${user.firstName}`}</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText></DialogContentText>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {}
              const labelProps: {
                optional?: React.ReactNode
              } = {}
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                )
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
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
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
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
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
        {/* <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
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
                <TextInput
                  control={control}
                  label="Username"
                  name="username"
                  placeholder="Username"
                  inputProps={{ position: 'start', icon: <AccountCircle /> }}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
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
                <TextInput
                  control={control}
                  label="Verification Code"
                  name="code"
                  placeholder="Verification Code"
                  inputProps={{ position: 'start', icon: <AccountCircle /> }}
                />
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form> */}
      </DialogContent>
    </Dialog>
  )
}
