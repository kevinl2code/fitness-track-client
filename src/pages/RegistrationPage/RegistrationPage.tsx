import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  FormControl,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material'
import WcIcon from '@mui/icons-material/Wc'
import EmailIcon from '@mui/icons-material/Email'
import EventIcon from '@mui/icons-material/Event'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import React, { useContext } from 'react'
import {
  Control,
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import { Link, useNavigate } from 'react-router-dom'
// import { setUser, UserContext } from '../../app/App'
import { ROUTES } from '../../navigation'
import { AuthService } from '../../services/AuthService'
import { TextInput } from '../../components/form/TextInput'
import { Email } from '@mui/icons-material'

interface IFormInput {
  userName: string
  password: string
}

interface GenerateInputProps {
  name: string
  control: Control<FieldValues, object>
  label: string
  placeholder: string
  inputProps?: {
    position: 'start' | 'end'
    icon: React.ReactNode
  }
}

export const RegistrationPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const authService = new AuthService()
  // const user = useContext(UserContext)

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data)
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
        <TextInput
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
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
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
                  name: 'firstName',
                  control: control,
                  label: 'First Name',
                  placeholder: 'First Name',
                  inputProps: {
                    position: 'start',
                    icon: <AccountCircle />,
                  },
                })}
                {generateInput({
                  name: 'lastName',
                  control: control,
                  label: 'Last Name',
                  placeholder: 'Last Name',
                  inputProps: {
                    position: 'start',
                    icon: <AccountCircle />,
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
                  <TextInput
                    control={control}
                    label="Sex"
                    name="sex"
                    placeholder="Sex"
                    inputProps={{ position: 'start', icon: <WcIcon /> }}
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
                  <TextInput
                    control={control}
                    label="Height"
                    name="height"
                    placeholder="Height"
                    inputProps={{
                      position: 'start',
                      icon: <AlignHorizontalLeftIcon />,
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
                  <TextInput
                    control={control}
                    label="Birthday"
                    name="birthday"
                    placeholder="yyyy-mm-dd"
                    inputProps={{ position: 'start', icon: <EventIcon /> }}
                  />
                </Grid>
                {generateInput({
                  name: 'userName',
                  control: control,
                  label: 'Username',
                  placeholder: 'Username',
                  inputProps: {
                    position: 'start',
                    icon: <AccountCircle />,
                  },
                })}
                {generateInput({
                  name: 'password',
                  control: control,
                  label: 'Password',
                  placeholder: 'Password',
                  inputProps: {
                    position: 'start',
                    icon: <LockIcon />,
                  },
                })}
                {generateInput({
                  name: 'confirmPassword',
                  control: control,
                  label: 'Confirm Password',
                  placeholder: 'Confirm Password',
                  inputProps: {
                    position: 'start',
                    icon: <LockIcon />,
                  },
                })}
                {generateInput({
                  name: 'email',
                  control: control,
                  label: 'Email',
                  placeholder: 'Email',
                  inputProps: {
                    position: 'start',
                    icon: <Email />,
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
  )
}
