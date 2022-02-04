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
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { DailyEntry, EntryConsumable } from '../../../model/Model'
import { UseApi } from '../../../pages/DailyEntriesPage/UseApi'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { AddCustomConsumableForm } from './AddCustomConsumableForm'
import { AddFoodCatalogConsumableForm } from './AddFoodCatalogConsumableForm'

interface Props {
  entry: DailyEntry
  useApi: UseApi
  open: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

type EntryMethod = 'CATALOG' | 'MYFOODS' | 'CUSTOM' | null

export const AddConsumableToDailyEntryDialog: React.FC<Props> = ({
  open,
  useApi,
  setDialogOpenState,
}) => {
  const [entryMethod, setEntryMethod] = useState<EntryMethod>(null)
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { matchesMD } = useMediaQueries()
  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
    setEntryMethod(null)
  }

  const onSubmit: SubmitHandler<EntryConsumable> = async (data: any) => {
    if (typeof data === 'object' && 'calories' in data) {
      data.calories = parseInt(data.calories)
    }
    if (typeof data === 'object' && 'protein' in data) {
      data.protein = parseInt(data.protein)
    }
    useApi.addConsumable(data)
    handleCloseDialog()
  }

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullScreen={!matchesMD}>
      <DialogTitle>Add Consumable</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        {entryMethod === null && (
          <Grid container direction={matchesMD ? 'row' : 'column'}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('CATALOG')}
            >
              Food Catalog
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('MYFOODS')}
            >
              My Foods
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('CUSTOM')}
            >
              Custom
            </Button>
          </Grid>
        )}
        {entryMethod === 'CUSTOM' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            {<AddCustomConsumableForm control={control} />}
          </form>
        )}
        {entryMethod === 'CATALOG' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            {<AddFoodCatalogConsumableForm />}
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
