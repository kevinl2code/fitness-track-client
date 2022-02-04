import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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
    setValue,
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
      data.calories = parseFloat(data.calories)
    }
    if (typeof data === 'object' && 'protein' in data) {
      data.protein = parseFloat(data.protein)
    }
    if (typeof data === 'object' && 'fat' in data) {
      data.fat = parseFloat(data.fat)
    }
    if (typeof data === 'object' && 'carbohydrates' in data) {
      data.carbohydrates = parseFloat(data.carbohydrates)
    }
    // console.log(data)
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
            <AddCustomConsumableForm control={control} />
            <Grid container justifyContent="center">
              <Button
                variant="contained"
                type="submit"
                sx={[
                  { marginTop: '1rem', marginBottom: '1rem' },
                  matchesMD && { marginTop: 0 },
                ]}
              >
                Submit
              </Button>
            </Grid>
          </form>
        )}
        {entryMethod === 'CATALOG' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <AddFoodCatalogConsumableForm
              control={control}
              setValue={setValue}
              reset={reset}
            />
            <Grid container justifyContent="center">
              <Button
                variant="contained"
                type="submit"
                sx={[
                  { marginTop: '1rem', marginBottom: '1rem' },
                  matchesMD && { marginTop: 0 },
                ]}
              >
                Submit
              </Button>
            </Grid>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
