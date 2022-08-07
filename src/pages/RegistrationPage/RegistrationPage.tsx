import { yupResolver } from '@hookform/resolvers/yup'
import { Email } from '@mui/icons-material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import EventIcon from '@mui/icons-material/Event'
import LockIcon from '@mui/icons-material/Lock'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import WcIcon from '@mui/icons-material/Wc'
import {
  Button,
  ButtonGroup,
  Grid,
  InputAdornment,
  Typography,
} from '@mui/material'
import React, { useEffect } from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { ConfirmRegistrationDialog } from '../../components/dialogs/ConfiirmRegistrationDialog/ConfirmRegistrationDialog'
import { FormSelectInput } from '../../components/form/FormSelectInput'
import { FormSelectInputProps } from '../../components/form/FormSelectInput/FormSelectInput'
import { FormTextInput } from '../../components/form/FormTextInput'
import { CognitoGender } from '../../model/Model'
import { AuthService } from '../../services/AuthService'

interface IFormInput {
  username: string
  password: string
  confirmPassword: string
  givenName: string
  familyName: string
  birthdate: string
  gender: CognitoGender
  height: number
  units: string
  email: string
}

interface GenerateInputProps {
  name: string
  control: Control<FieldValues, object>
  label: string
  placeholder: string
  helperText?: string
  inputProps?: {
    [key: string]: any
  }
}

const validationSchema = yup.object({
  givenName: yup
    .string()
    .matches(/^[a-z ,.'-]+$/i, 'Please enter valid name')
    .max(40)
    .required(),
  familyName: yup
    .string()
    .matches(/^[a-z ,.'-]+$/i, 'Please enter valid name')
    .max(40)
    .required(),
  gender: yup
    .string()
    .typeError('Selection required')
    .matches(/^male$|^female$/g, 'Selection required'),
  height: yup
    .number()
    .typeError('Height required')
    .when(['units'], (units, schema) =>
      units === 'Standard'
        ? schema.min(21, 'Must be over 21 inches')
        : schema.min(54, 'Must be over 54 centimeters')
    )
    .when(['units'], (units, schema) =>
      units === 'Standard'
        ? schema.max(103, 'Must be under 103 inches')
        : schema.max(262, 'Must be under 262 centimeters')
    )
    // .max(103, 'Must be under 103 inches')
    .positive()
    .integer()
    .required(),
  birthdate: yup
    .string()
    .matches(
      /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/i,
      'Must be in format yyyy-mm-dd'
    )
    .test(
      'valid-birthdate',
      'Birthday must result in valid age',
      function (value) {
        if (!value) {
          return false
        }
        const year = parseInt(value.slice(0, 4))
        if (year > 1920 && year < 2012) {
          return true
        } else {
          return false
        }
      }
    )
    .required(),
  username: yup
    .string()
    .min(4, 'Must be at least 4 characters')
    .matches(/^[a-z]/i, 'Username must begin with a letter')
    .matches(
      /^[a-z][a-z\d]+$/i,
      'Username can only consist of letters and numbers'
    )
    .max(15, 'Username cannot exceed 15 characters')
    .required(),
  password: yup
    .string()
    .min(8, 'Must be at least 8 characters')
    .matches(/^\S*$/, 'Cannot contain spaces')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
      'Must include a number and both upper and lowercase letters'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    })
    .required('Password confirmation required'),
  email: yup
    .string()
    .email('Must be in valid email format')
    .required('Email is required'),
})

export const RegistrationPage: React.FC = () => {
  const [openConfirmRegistrationDialog, setOpenConfirmRegistrationDialog] =
    React.useState(false)
  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const authService = new AuthService()
  const selectedUnits = watch().units
  useEffect(() => {}, [selectedUnits])
  const handleOpenConfirmRegistrationDialog = () => {
    setOpenConfirmRegistrationDialog(true)
  }

  // const handleHeightUnitsChange = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newHeightUnits: string | null
  // ) => {
  //   if (newHeightUnits !== null) {
  //     setHeightUnits(newHeightUnits)
  //   }
  // }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let height = data.height
    const units = data.units
    if (units === 'Metric') {
      height = Math.round(data.height / 2.54)
    }

    const result = await authService.signUp(
      data.username,
      data.password,
      data.givenName,
      data.familyName,
      data.birthdate,
      data.gender.toLowerCase() as CognitoGender,
      height.toString(),
      data.email
    )
    if (result) {
      handleOpenConfirmRegistrationDialog()
    } else {
      console.log('Login failed. Please check your credentials')
    }
  }

  const generateInput = ({
    name,
    control,
    label,
    placeholder,
    helperText,
    inputProps,
  }: GenerateInputProps) => {
    return (
      <Grid
        item
        xs={12}
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
  const generateSelectInput = ({
    name,
    values,
    control,
    startAdornment,
    register,
    label,
    placeholder,
    defaultValue,
    allowNone,
  }: FormSelectInputProps) => {
    return (
      <Grid
        item
        xs={12}
        container
        direction={'column'}
        sx={{
          paddingBottom: '1rem',
        }}
      >
        <FormSelectInput
          control={control}
          register={register}
          placeholder={placeholder}
          defaultValue={defaultValue}
          // required={true}
          label={label}
          name={name}
          values={values}
          startAdornment={startAdornment}
          allowNone={allowNone}
        />
      </Grid>
    )
  }

  const genderValues = [
    {
      name: 'Male',
      value: 'Male',
    },
    {
      name: 'Female',
      value: 'Female',
    },
  ]
  const unitsValues = [
    {
      name: 'Standard',
      value: 'Standard',
    },
    {
      name: 'Metric',
      value: 'Metric',
    },
  ]
  return (
    <>
      <ConfirmRegistrationDialog
        setDialogOpenState={setOpenConfirmRegistrationDialog}
        open={openConfirmRegistrationDialog}
      />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%', padding: '2rem' }}
      >
        <Grid item>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container justifyContent="center">
              {generateInput({
                name: 'givenName',
                control: control,
                label: 'First Name',
                placeholder: 'First Name',
                inputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              })}
              {generateInput({
                name: 'familyName',
                control: control,
                label: 'Last Name',
                placeholder: 'Last Name',
                inputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              })}
              {generateSelectInput({
                name: 'gender',
                control: control,
                startAdornment: <WcIcon />,
                register: register,
                label: 'Sex',
                placeholder: 'Sex',
                values: genderValues,
              })}
              {generateSelectInput({
                name: 'units',
                control: control,
                startAdornment: <SquareFootIcon />,
                register: register,
                label: 'Measurement Units',
                placeholder: unitsValues[0].value,
                values: unitsValues,
                defaultValue: unitsValues[0].value,
                allowNone: false,
              })}
              <Grid
                item
                xs={12}
                container
                direction={'column'}
                sx={{
                  paddingBottom: '1rem',
                }}
              >
                <FormTextInput
                  control={control}
                  label="Height"
                  name="height"
                  placeholder="Height"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlignHorizontalLeftIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <Typography style={{ opacity: 0.5 }}>
                        {selectedUnits === 'Metric' ? 'CM' : 'INCHES'}
                      </Typography>
                    ),
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                container
                direction={'column'}
                sx={{
                  paddingBottom: '1rem',
                }}
              >
                <FormTextInput
                  control={control}
                  label="Birthday"
                  name="birthdate"
                  placeholder="yyyy-mm-dd"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {generateInput({
                name: 'username',
                control: control,
                label: 'Username',
                placeholder: 'Username',
                inputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              })}
              {generateInput({
                name: 'password',
                control: control,
                label: 'Password',
                placeholder: 'Password',
                inputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                },
              })}
              {generateInput({
                name: 'confirmPassword',
                control: control,
                label: 'Confirm Password',
                placeholder: 'Confirm Password',
                inputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                },
              })}
              {generateInput({
                name: 'email',
                control: control,
                label: 'Email',
                placeholder: 'Email',
                inputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                },
              })}

              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: '1rem' }}
                fullWidth
              >
                Register
              </Button>
            </Grid>
          </form>
          <Grid container justifyContent="center" sx={{ marginTop: '1rem' }}>
            <Grid item>
              <Link to={`/`} style={{ textDecoration: 'none' }}>
                Cancel
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
