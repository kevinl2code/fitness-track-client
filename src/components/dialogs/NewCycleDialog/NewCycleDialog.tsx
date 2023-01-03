import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  MobileStepper,
  Grid,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import { Cycle, UserState, CycleType } from '../../../model/Model'
import { ROUTES } from '../../../navigation'
import { dataService } from '../../../app/App'
import { NewCycleDialogForm } from './NewCycleDialogForm'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

interface Props {
  open: boolean
  user: UserState
  isNewUser: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFormInput {
  startingWeight: string
  goalWeight: string
  duration: string
}

const validationSchema = yup.object({
  startingWeight: yup
    .number()
    .typeError('Starting Weight is required')
    .min(50, ({ min }) => `Must be ${min} lbs or more`)
    .max(1000, ({ max }) => `Must be ${max} lbs or less`)
    .required('Starting Weight is required'),
  goalWeight: yup
    .number()
    .typeError('Starting Weight is required')
    .min(50, ({ min }) => `Must be ${min} lbs or more`)
    .max(1000, ({ max }) => `Must be ${max} lbs or less`)
    .required('Goal Weight is required'),
  duration: yup
    .number()
    .integer('Must be a whole number')
    .typeError('Number of days is required')
    .min(7, 'Must be at least 7 days')
    .max(100, 'Must be 100 days or less')
    .required('Duration is required'),
})

const steps = ['Current Weight', 'Goal Weight', 'Timeframe', 'Review']

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

export const NewCycleDialog: React.FC<Props> = ({
  open,
  user,
  isNewUser,
  setDialogOpenState,
}) => {
  const theme = useTheme()
  const ftlogo = `${process.env.PUBLIC_URL}/ftlogo.png`
  const [activeStep, setActiveStep] = React.useState(0)
  const { setValue, handleSubmit, control, formState, getValues, reset } =
    useForm({
      mode: 'onTouched',
      resolver: yupResolver(validationSchema),
    })
  const errors = formState.errors
  const hasErrors = Object.keys(errors).length !== 0
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      setValue('startingWeight', '')
      setValue('goalWeight', '')
      setValue('duration', '')
    }
  }, [setValue])

  const { mutate: createNewCycle, isLoading: createNewCycleLoading } =
    useMutation(
      (newUserCycle: Cycle) => dataService.createUserCycle(newUserCycle),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries('cycles')
          setDialogOpenState(false)
          navigate(`../${ROUTES.dailyEntries}`, { replace: true })
        },
      }
    )

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleCancel = () => {
    setDialogOpenState(false)
    reset()
  }
  const values = getValues()
  const today = DateTime.now().toISODate()?.split('-')?.join('')
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let cycleType
    if (data.goalWeight < data.startingWeight) {
      cycleType = CycleType.CUT
    } else if (data.goalWeight > data.startingWeight) {
      cycleType = CycleType.BULK
    } else {
      cycleType = CycleType.MAINTAIN
    }
    const newCycleId = v4()
    const startingWeight = Math.round(parseFloat(data.startingWeight) * 10) / 10
    const duration = parseInt(data.duration)
    const endingDate = DateTime.now()
      .plus({ days: duration })
      .toISODate()
      ?.split('-')
      ?.join('')
    const newUserCycle: Cycle = {
      PK: user.sub,
      SK: `C_${newCycleId}`,
      GSI2PK: `U_${user.sub}`,
      GSI2SK: 'CYCLES',
      type: 'CYCLE',
      cycleType: cycleType,
      startingWeight: startingWeight,
      endingWeight: null,
      goalWeight: parseFloat(data.goalWeight),
      startDate: today,
      endingDate: endingDate,
      duration: duration,
      isActive: true,
      cycleId: newCycleId,
    }
    createNewCycle(newUserCycle)
  }
  const disableNextButton = (activeStep: number) => {
    const currentStep: {
      [key: number]: string
    } = {
      0: 'startingWeight',
      1: 'goalWeight',
      2: 'duration',
    }
    if (errors[currentStep[activeStep]]) {
      return true
    }
    if (
      values[currentStep[activeStep]]?.length < 1 ||
      !values[currentStep[activeStep]]
    ) {
      return true
    }

    return false
  }

  const stepperForwardButton =
    activeStep === steps.length - 1 ? (
      <Button size="small" onClick={handleSubmit(onSubmit)}>
        Finish
      </Button>
    ) : (
      <Button
        size="small"
        onClick={handleNext}
        disabled={disableNextButton(activeStep)}
      >
        Next
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </Button>
    )

  const stepperBackButton =
    activeStep === 0 && !isNewUser ? (
      <Button size="small" onClick={() => setDialogOpenState(false)}>
        Cancel
      </Button>
    ) : (
      <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
        Back
      </Button>
    )

  return (
    <Dialog
      open={open}
      fullWidth
      fullScreen={true}
      PaperProps={{ style: { backgroundColor: '#f0f4f7' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', padding: 0 }}>
        START YOUR NEW PLAN
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%', height: '100%', backgroundColor: '#f0f4f7' }}
        >
          <Grid item container>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ marginTop: '2rem', width: '100%' }}
            >
              <NewCycleDialogForm
                activeStep={activeStep}
                control={control}
                values={values}
                hasErrors={hasErrors}
              />
            </form>
          </Grid>
          <Grid item container>
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={activeStep}
              sx={{ maxWidth: 400, flexGrow: 1, backgroundColor: '#f0f4f7' }}
              nextButton={stepperForwardButton}
              backButton={
                stepperBackButton
                // <Button
                //   size="small"
                //   onClick={handleBack}
                //   disabled={activeStep === 0}
                // >
                //   {theme.direction === 'rtl' ? (
                //     <KeyboardArrowRight />
                //   ) : (
                //     <KeyboardArrowLeft />
                //   )}
                //   Back
                // </Button>
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
