import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { DailyEntry } from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { AddCustomConsumableForm } from './AddCustomConsumableForm'
import { AddFoodCatalogConsumableForm } from './AddFoodCatalogConsumableForm'
import { AddMyFoodsConsumableForm } from './AddMyFoodsConsumableForm'

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

  const queryClient = useQueryClient()
  const { matchesMD } = useMediaQueries()
  const handleCloseDialog = () => {
    setDialogOpenState(false)
    setEntryMethod(null)
  }

  const { mutate: updateDailyEntry, isLoading } = useMutation(
    (dailyEntry: DailyEntry) => dataService.updateDailyEntry(dailyEntry),
    {
      onSuccess: (data: DailyEntry) => {
        queryClient.invalidateQueries('dailyEntries')
        // queryClient.setQueryData(
        //   'dailyEntries',
        //   (oldDailyEntries: DailyEntry[] | undefined) => {
        //     const filteredOldDailyEntries = oldDailyEntries?.filter(
        //       (oldDailyEntry) => oldDailyEntry.SK !== data.SK
        //     )
        //     return [...filteredOldDailyEntries!, data]
        //   }
        // )
        const queriesData = queryClient.getQueriesData('dailyEntries')
        handleCloseDialog()
        // console.log({ mutationData: data })
        console.log({ cacheData: queriesData })
      },
    }
  )

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
              sx={{ marginBottom: '1rem' }}
            >
              Food Catalog
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('MYFOODS')}
              sx={{ marginBottom: '1rem' }}
            >
              My Foods
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('CUSTOM')}
              sx={{ marginBottom: '1rem' }}
            >
              Custom
            </Button>
          </Grid>
        )}
        {entryMethod === 'CUSTOM' && (
          <AddCustomConsumableForm
            entry={entry}
            updateDailyEntry={updateDailyEntry}
          />
        )}
        {entryMethod === 'CATALOG' && (
          <AddFoodCatalogConsumableForm
            entry={entry}
            updateDailyEntry={updateDailyEntry}
          />
        )}
        {entryMethod === 'MYFOODS' && (
          <AddMyFoodsConsumableForm
            entry={entry}
            updateDailyEntry={updateDailyEntry}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
