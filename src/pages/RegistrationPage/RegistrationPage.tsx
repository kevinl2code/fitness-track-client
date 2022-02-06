import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  InputAdornment,
} from '@mui/material'
import WcIcon from '@mui/icons-material/Wc'
import EventIcon from '@mui/icons-material/Event'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import React, { useCallback } from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import { Link } from 'react-router-dom'
import { AuthService } from '../../services/AuthService'
import { CollectionsBookmarkRounded, Email } from '@mui/icons-material'
import { CognitoGender } from '../../model/Model'
import { ConfirmRegistrationDialog } from '../../components/dialogs/ConfiirmRegistrationDialog/ConfirmRegistrationDialog'
import { FormTextInput } from '../../components/form/FormTextInput'
import { FormSelectInput } from '../../components/form/FormSelectInput'
import { FormSelectInputProps } from '../../components/form/FormSelectInput/FormSelectInput'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface IFormInput {
  username: string
  password: string
  confirmPassword: string
  givenName: string
  familyName: string
  birthdate: string
  gender: CognitoGender
  height: number
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
    .typeError('Height in inches required')
    .min(21, 'Must be over 21 inches')
    .max(103, 'Must be under 103 inches')
    .required()
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const authService = new AuthService()

  const handleOpenConfirmRegistrationDialog = () => {
    setOpenConfirmRegistrationDialog(true)
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data)
    const result = await authService.signUp(
      data.username,
      data.password,
      data.givenName,
      data.familyName,
      data.birthdate,
      data.gender,
      data.height,
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
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '1rem',
        }}
      >
        <FormTextInput
          control={control}
          label={label}
          name={name}
          placeholder={placeholder}
          helperText={helperText}
          inputProps={inputProps}
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
  }: FormSelectInputProps) => {
    return (
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
        <FormSelectInput
          control={control}
          register={register}
          placeholder={placeholder}
          // required={true}
          label={label}
          name={name}
          values={values}
          startAdornment={startAdornment}
        />
      </Grid>
    )
  }

  const genderValues = [
    {
      name: 'Male',
      value: 'male',
    },
    {
      name: 'Female',
      value: 'female',
    },
  ]
  console.log(getValues())
  return (
    <>
      <ConfirmRegistrationDialog
        setDialogOpenState={setOpenConfirmRegistrationDialog}
        open={openConfirmRegistrationDialog}
      />
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={6} lg={7} xl={7}>
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant="h4" align="center">
                Registration
              </Typography>
            </CardContent>
            <CardContent>
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
                    <FormTextInput
                      control={control}
                      label="Height"
                      name="height"
                      placeholder="Height"
                      inputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AlignHorizontalLeftIcon />
                          </InputAdornment>
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
                      paddingLeft: '2rem',
                      paddingRight: '2rem',
                      paddingBottom: '1rem',
                    }}
                  >
                    <FormTextInput
                      control={control}
                      label="Birthday"
                      name="birthdate"
                      placeholder="yyyy-mm-dd"
                      inputProps={{
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
                  >
                    Register
                  </Button>
                </Grid>
              </form>
            </CardContent>
            <CardContent>
              <Grid container justifyContent="center">
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                  Cancel
                </Link>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
