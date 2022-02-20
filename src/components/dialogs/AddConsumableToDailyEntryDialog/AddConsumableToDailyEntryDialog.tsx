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
import { useMutation, useQueryClient } from 'react-query'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { AddCustomConsumableForm } from './AddCustomConsumableForm'
import { AddFoodCatalogConsumableForm } from './AddFoodCatalogConsumableForm'
import { DataService } from '../../../services/DataService'

interface IFormInput {
  name: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
}

interface Props {
  entry: DailyEntry
  dataService: DataService
  open: boolean
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}

type EntryMethod = 'CATALOG' | 'MYFOODS' | 'CUSTOM' | null

export const AddConsumableToDailyEntryDialog: React.FC<Props> = ({
  entry,
  open,
  dataService,
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
  const queryClient = useQueryClient()
  const { matchesMD } = useMediaQueries()
  const handleCloseDialog = () => {
    setDialogOpenState(false)
    reset()
    setEntryMethod(null)
  }

  const { mutate: updateDailyEntry, isLoading } = useMutation(
    (dailyEntry: DailyEntry) => dataService.updateDailyEntry(dailyEntry),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('dailyEntries')
        handleCloseDialog()
        console.log({ mutationData: data })
      },
    }
  )

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { name, calories, protein, fat, carbohydrates } = data
    const newConsumable: EntryConsumable = {
      name: name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbohydrates: parseFloat(carbohydrates),
    }
    const updatedConsumables = [...entry.dailyEntryConsumables, newConsumable]
    const updatedEntry = { ...entry, dailyEntryConsumables: updatedConsumables }
    updateDailyEntry(updatedEntry)
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
