import {
  Grid,
  Typography,
  FormControl,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useQueryClient, useMutation } from 'react-query'
import { Cycle, DailyEntry, UserState } from '../../model/Model'
import { AppLoadingPage } from '../../pages/AppLoadingPage'
import { DataService } from '../../services/DataService'
import { Calculate } from '../../utilities/Calculate'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DateTime } from 'luxon'

interface IFormInput {
  weight: string
}

interface Props {
  date: string
  daysRemaining: number
  user: UserState
  cycle: Cycle
  dataService: DataService
  cycleEndDate: DateTime | null
  setPickerDate: React.Dispatch<React.SetStateAction<DateTime>>
}

const wellDone = `${process.env.PUBLIC_URL}/welldone.svg`

const validationSchema = yup.object({
  weight: yup
    .number()
    .typeError('Value for weight is required')
    .min(50, ({ min }) => `Must be ${min} lbs or more`)
    .max(1000, ({ max }) => `Must be ${max} lbs or less`)
    .required('Value for weight is required'),
})
export const DailyEntryLastDay: React.FC<Props> = ({
  date,
  daysRemaining,
  user,
  cycle,
  dataService,
  cycleEndDate,
  setPickerDate,
  // refetchEntries,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) })

  const queryClient = useQueryClient()
  const calculate = new Calculate()
  const { birthday, sex, height, sub } = user
  const age = calculate.age(birthday)
  const weightDefaultValue = ''

  const { mutate: updateCycle, isLoading: updateCycleIsLoading } = useMutation(
    (cycle: Cycle) => dataService.updateUserCycle(cycle),
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(['cycles'])
        setPickerDate(cycleEndDate?.startOf('day').minus({ days: 1 })!)
      },
    }
  )

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log({ formdata: data })
    const weight = parseFloat(data.weight)
    const finalizedCycle: Cycle = {
      ...cycle,
      endingWeight: weight,
      isActive: false,
    }

    // createNewDailyEntry(newDailyEntry)
    updateCycle(finalizedCycle)
  }

  const formHeaderText =
    'Congrats on making it all the way!  Weigh in one last time to complete your current program!'

  if (updateCycleIsLoading) {
    return <AppLoadingPage color={'#fff'} />
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ marginTop: '2rem' }}
      >
        <Typography
          textAlign="center"
          variant="h6"
          sx={{ color: 'primary.main', fontWeight: 700, marginBottom: '1rem' }}
        >
          {formHeaderText}
        </Typography>
        <img
          src={wellDone}
          alt="Celebration with balloons"
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
              sx={{ padding: '2rem 0 2rem 0' }}
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
                        helperText={invalid && errors.weight.message}
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
