import { Card, CardContent, Typography, Grid, Button } from '@mui/material'
import React from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/AuthService'
import { Email } from '@mui/icons-material'
import { FormTextInput } from '../../components/form/FormTextInput'

interface IFormInput {
  username: string
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

export const ForgotPasswordPage: React.FC = () => {
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
    const result = await authService.forgotPassword(data.username)
    console.log(result)
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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%' }}
    >
      <Grid item xs={12} sm={6} md={6} lg={7} xl={7}>
        <Typography variant="h4" align="center">
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            {generateInput({
              name: 'username',
              control: control,
              label: 'Username',
              placeholder: 'Enter your username',
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
              Submit
            </Button>
          </Grid>
        </form>
        <Grid container justifyContent="center">
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            Cancel
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}
