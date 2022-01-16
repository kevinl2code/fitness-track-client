import { AccountCircle } from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
} from '@mui/material'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { DailyEntry, Meal } from '../../../model/Model'
import { UseApi } from '../../../pages/DailyEntriesPage/UseApi'
import { AuthService } from '../../../services/AuthService'
import { TextInput } from '../../form/TextInput'

interface Props {
  open: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFormInput {
  username: string
  code: string
}

export const ConfirmRegistrationDialog: React.FC<Props> = ({
  open,
  setDialogOpenState,
}) => {
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const authService = new AuthService()
  const navigate = useNavigate()

  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data: any) => {
    const result = await authService.confirmSignUp(data.username, data.code)
    if (result) {
      reset()
      setDialogOpenState(false)
      navigate('/')
    } else {
      console.log('Confirmation failed. Please check your credentials')
    }
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Confirm Registration</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText></DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
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
                  label="Username"
                  name="username"
                  placeholder="Username"
                  inputProps={{ position: 'start', icon: <AccountCircle /> }}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
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
                  label="Verification Code"
                  name="code"
                  placeholder="Verification Code"
                  inputProps={{ position: 'start', icon: <AccountCircle /> }}
                />
              </Grid>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}