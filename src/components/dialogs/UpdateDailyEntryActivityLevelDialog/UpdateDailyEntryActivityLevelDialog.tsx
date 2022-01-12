import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  Select,
  MenuItem,
  Button,
  DialogActions,
  Divider,
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { DailyEntry, Meal } from '../../../model/Model'
import { UseApi } from '../../../pages/DailyEntriesPage/UseApi'
import { DataService } from '../../../services/DataService'

interface Props {
  entry: DailyEntry
  open: boolean
  useApi: UseApi
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateDailyEntryActivityLevelDialog: React.FC<Props> = ({
  entry,
  open,
  useApi,
  setDialogOpenState,
}) => {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
  }

  const onSubmit: SubmitHandler<Partial<Meal>> = async (data: any) => {
    useApi.updateActivityLevel(data)
    setDialogOpenState(false)
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Add Meal</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          {`Edit activity level on daily entry for ${entry?.date}`}
        </DialogContentText>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center">
            <Grid item container alignItems="center" sx={{ padding: '2rem' }}>
              <Grid item xs={8}>
                Acivity Level
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="activityLevel"
                  control={control}
                  defaultValue="SEDENTARY"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      {...register}
                      variant="standard"
                      value={value}
                      onChange={onChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      sx={{ minWidth: '100%' }}
                    >
                      <MenuItem value={'SEDENTARY'}>SEDENTARY</MenuItem>
                      <MenuItem value={'LIGHTLY_ACTIVE'}>
                        LIGHTLY ACTIVE
                      </MenuItem>
                      <MenuItem value={'MODERATELY_ACTIVE'}>
                        MODERATELY ACTIVE
                      </MenuItem>
                      <MenuItem value={'VERY_ACTIVE'}>VERY ACTIVE</MenuItem>
                      <MenuItem value={'EXTRA_ACTIVE'}>EXTRA ACTIVE</MenuItem>
                    </Select>
                  )}
                />
              </Grid>
            </Grid>
            <Divider variant="middle" sx={{ minWidth: '100%' }} />
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
