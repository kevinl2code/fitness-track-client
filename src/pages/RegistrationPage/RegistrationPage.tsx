import { Card, CardContent, Typography, Grid, Button } from '@mui/material'
import WcIcon from '@mui/icons-material/Wc'
import EventIcon from '@mui/icons-material/Event'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import React from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import { Link } from 'react-router-dom'
import { AuthService } from '../../services/AuthService'
import { Email } from '@mui/icons-material'
import { CognitoGender } from '../../model/Model'
import { ConfirmRegistrationDialog } from '../../components/dialogs/ConfiirmRegistrationDialog/ConfirmRegistrationDialog'
import { FormTextInput } from '../../components/form/FormTextInput'

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
  inputProps?: {
    position: 'start' | 'end'
    child: React.ReactNode | string
  }
}

export const RegistrationPage: React.FC = () => {
  const [openConfirmRegistrationDialog, setOpenConfirmRegistrationDialog] =
    React.useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const authService = new AuthService()
  // const user = useContext(UserContext)

  const handleOpenConfirmRegistrationDialog = () => {
    setOpenConfirmRegistrationDialog(true)
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
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
          inputProps={inputProps}
        />
      </Grid>
    )
  }

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
                      position: 'start',
                      child: <AccountCircle />,
                    },
                  })}
                  {generateInput({
                    name: 'familyName',
                    control: control,
                    label: 'Last Name',
                    placeholder: 'Last Name',
                    inputProps: {
                      position: 'start',
                      child: <AccountCircle />,
                    },
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
                      label="Sex"
                      name="gender"
                      placeholder="Sex"
                      inputProps={{ position: 'start', child: <WcIcon /> }}
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
                      label="Height"
                      name="height"
                      placeholder="Height"
                      inputProps={{
                        position: 'start',
                        child: <AlignHorizontalLeftIcon />,
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
                      inputProps={{ position: 'start', child: <EventIcon /> }}
                    />
                  </Grid>
                  {generateInput({
                    name: 'username',
                    control: control,
                    label: 'Username',
                    placeholder: 'Username',
                    inputProps: {
                      position: 'start',
                      child: <AccountCircle />,
                    },
                  })}
                  {generateInput({
                    name: 'password',
                    control: control,
                    label: 'Password',
                    placeholder: 'Password',
                    inputProps: {
                      position: 'start',
                      child: <LockIcon />,
                    },
                  })}
                  {generateInput({
                    name: 'confirmPassword',
                    control: control,
                    label: 'Confirm Password',
                    placeholder: 'Confirm Password',
                    inputProps: {
                      position: 'start',
                      child: <LockIcon />,
                    },
                  })}
                  {generateInput({
                    name: 'email',
                    control: control,
                    label: 'Email',
                    placeholder: 'Email',
                    inputProps: {
                      position: 'start',
                      child: <Email />,
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
