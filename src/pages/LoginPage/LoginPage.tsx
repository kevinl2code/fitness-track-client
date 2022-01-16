import { Card, CardContent, Typography, Button, Grid } from '@mui/material'
import { TextInput } from '../../components/form/TextInput'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../navigation'
import { AuthService } from '../../services/AuthService'
import { CognitoUser } from '@aws-amplify/auth'

interface IFormInput {
  userName: string
  password: string
}

interface Props {
  setUser: React.Dispatch<React.SetStateAction<CognitoUser | null>>
}

export const LoginPage: React.FC<Props> = ({ setUser }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const authService = new AuthService()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result = await authService.login(data.userName, data.password)
    if (result) {
      setUser(result.cognitoUser)
      navigate(`app/${ROUTES.dashboard}`)
    } else {
      console.log('Login failed. Please check your credentials')
    }
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Card variant="outlined" sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h4" align="center">
              Login
            </Typography>
          </CardContent>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container justifyContent="center">
                <Grid
                  item
                  xs={12}
                  container
                  direction={'column'}
                  sx={{ padding: '2rem' }}
                >
                  <TextInput
                    control={control}
                    label="Username"
                    name="userName"
                    placeholder="Type your username"
                    inputProps={{ position: 'start', icon: <AccountCircle /> }}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction={'column'}
                  alignItems="flex-end"
                  sx={{
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                    paddingBottom: '2rem',
                  }}
                >
                  <TextInput
                    control={control}
                    label="Password"
                    name="password"
                    placeholder="Type your password"
                    inputProps={{ position: 'start', icon: <LockIcon /> }}
                  />
                  <Link to={ROUTES.forgot} style={{ textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Grid>
            </form>
          </CardContent>
          <CardContent>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography align="center">
                  New to FitnessTrack?&nbsp;
                </Typography>
              </Grid>
              <Grid item>
                <Link to={ROUTES.register} style={{ textDecoration: 'none' }}>
                  Join now
                </Link>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
