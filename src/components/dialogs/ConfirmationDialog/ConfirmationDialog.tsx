import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormTextInput } from '../../form/FormTextInput'
import * as yup from 'yup'

interface IFormInput {
  delete: string
}

interface Props {
  open: boolean
  deleteItem: {
    name: string
    id: string
  } | null
  handleConfirmation: () => void
  setConfirmDeleteDialogOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      deleteItem: {
        name: string
        id: string
      } | null
    }>
  >
}

const validationSchema = yup.object({
  delete: yup
    .string()
    .required('Confirmation required')
    .matches(/^DELETE$/g, 'Must match "DELETE"'),
})

export const ConfirmationDialog: React.FC<Props> = ({
  open,
  deleteItem,
  handleConfirmation,
  setConfirmDeleteDialogOpen,
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const handleCancel = () => {
    reset()
    setConfirmDeleteDialogOpen({
      open: false,
      deleteItem: null,
    })
  }

  if (!deleteItem) {
    return null
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    handleConfirmation()
    reset()
  }

  return (
    <Dialog open={open} fullScreen={true}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Typography>{`Are you sure you want to permanently delete ${deleteItem.name}?`}</Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container justifyContent="center">
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
                label="Type DELETE to confirm"
                name="delete"
              />
            </Grid>
            <Button
              variant="contained"
              type="submit"
              sx={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              Delete
            </Button>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancel()} sx={{ marginBottom: '1rem' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
