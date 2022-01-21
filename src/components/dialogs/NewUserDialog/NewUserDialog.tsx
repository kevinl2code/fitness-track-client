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
} from '@mui/material'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Cycle, UserState, CycleType } from '../../../model/Model'
import { UseApi } from '../../../pages/DashboardPage/UseApi'
import { AuthService } from '../../../services/AuthService'
import { TextInput } from '../../form/TextInput'
import { NewUserDialogForm } from './NewUserDialogForm'

interface Props {
  open: boolean
  user: UserState
  useApi: UseApi
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
  useApi,
  setDialogOpenState,
}) => {
  const [activeStep, setActiveStep] = React.useState(0)
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
  const values = getValues()
  const today = DateTime.now().toISODate()?.split('-')?.join('')
  const onSubmit: SubmitHandler<IFormInput> = async (data: any) => {
    let cycleType
    if (values.goalWeight < values.currentWeight) {
      cycleType = CycleType.CUT
    } else if (values.goalWeight > values.currentWeight) {
      cycleType = CycleType.BULK
    } else {
      cycleType = CycleType.MAINTAIN
    }
    const newUserCycle: Cycle = {
      userId: user.sub,
      sortKey: 'cycle001',
      cycleType: cycleType,
      startingWeight: values.currentWeight,
      goalWeight: values.goalWeight,
      startDate: today,
      duration: values.timeFrame,
    }
    await useApi.createNewUserCycle(newUserCycle)
    // console.log(newUserCycle)
  }

  const stepperButton =
    activeStep === steps.length - 1 ? (
      <Button onClick={handleSubmit(onSubmit)}>Finish</Button>
    ) : (
      <Button onClick={handleNext}>Next</Button>
    )

  return (
    <Dialog
      open={open}
      // onClose={handleCloseDialog}
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
              {stepperButton}
              {/* <Button
                form="ff"
                onClick={
                  activeStep === steps.length - 1
                    ? handleCloseDialog
                    : handleNext
                }
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button> */}
            </Box>
          </React.Fragment>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
