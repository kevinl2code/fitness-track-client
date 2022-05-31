import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import { Button, Grid, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { SelectedCycleContext, UserContext } from '../../app/App'
import { FormTextInput } from '../../components/form/FormTextInput'
import { User } from '../../model/Model'
import { ROUTES } from '../../navigation'
import { AuthService } from '../../services/AuthService'

interface IFormInput {
  userName: string
  password: string
}

interface Props {
  setUser: (user: User | null) => Promise<void>
}

export const LoginPage: React.FC<Props> = ({ setUser }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const authService = new AuthService()

  const user = useContext(UserContext)
  const cycle = useContext(SelectedCycleContext)

  // console.log(user)
  // console.log(cycle)

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result = await authService.login(data.userName, data.password)
    if (result) {
      setUser(result)
    } else {
      console.log('Login failed. Please check your credentials')
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', padding: '2rem' }}
    >
      <Grid item>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid
              item
              xs={12}
              container
              direction={'column'}
              sx={{ padding: '2rem 0 2rem 0' }}
            >
              <FormTextInput
                control={control}
                label="Username"
                name="userName"
                placeholder="Type your username"
                inputProps={{ position: 'start', child: <AccountCircle /> }}
              />
            </Grid>
            <Grid
              item
              container
              direction={'column'}
              alignItems="flex-end"
              sx={{
                // paddingLeft: '2rem',
                // paddingRight: '2rem',
                paddingBottom: '2rem',
              }}
            >
              <FormTextInput
                control={control}
                label="Password"
                name="password"
                placeholder="Type your password"
                inputProps={{ position: 'start', child: <LockIcon /> }}
              />
              <Link to={ROUTES.forgot} style={{ textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Grid>
            <Button variant="contained" type="submit" fullWidth>
              Login
            </Button>
          </Grid>
        </form>
      </Grid>
      <Grid container justifyContent="center" sx={{ marginTop: '1rem' }}>
        <Grid item>
          <Typography align="center">Don't have an account?&nbsp;</Typography>
        </Grid>
        <Grid item>
          <Link to={`../${ROUTES.register}`} style={{ textDecoration: 'none' }}>
            Sign up
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}
