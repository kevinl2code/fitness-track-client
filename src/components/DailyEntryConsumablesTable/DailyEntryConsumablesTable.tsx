import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Grid,
  Paper,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useMutation, useQueryClient } from 'react-query'
import React from 'react'
import { DailyEntry } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { DataService } from '../../services/DataService'

interface Props {
  entry: DailyEntry
  dataService: DataService
  isEditable: boolean
}

export const DailyEntryConsumablesTable: React.FC<Props> = ({
  entry,
  dataService,
  isEditable,
}) => {
  const queryClient = useQueryClient()

  const { dailyEntryConsumables } = entry

  const { mutate: updateDailyEntry, isLoading } = useMutation(
    (dailyEntry: DailyEntry) => dataService.updateDailyEntry(dailyEntry),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('dailyEntries')
      },
    }
  )

  const handleDeleteConsumable = async (consumableIndex: number) => {
    const updatedConsumables =
      dailyEntryConsumables.filter((consumable, index) => {
        return index !== consumableIndex
      }) ?? []
    const updatedEntry = { ...entry, dailyEntryConsumables: updatedConsumables }
    updateDailyEntry(updatedEntry)
  }

  if (dailyEntryConsumables.length === 0) {
    return null
  }

  const generatedRows = dailyEntryConsumables?.map((consumable, index) => (
    <TableRow
      key={`${consumable.name} + ${index}`}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell
        component="th"
        size="small"
        padding="none"
        scope="row"
        sx={{ padding: '8px 0px 8px 0px' }}
      >
        {consumable.name}
      </TableCell>
      <TableCell
        size="small"
        padding="none"
        align="right"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {consumable.calories.toFixed(0)}
      </TableCell>
      <TableCell
        size="small"
        padding="none"
        align="right"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          maxWidth: '5ch',
          textOverflow: 'ellipsis',
        }}
      >
        {consumable.protein.toFixed(0)}
      </TableCell>
      <TableCell
        size="small"
        padding="none"
        align="right"
        sx={{
          paddingLeft: '2ch',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          maxWidth: '6ch',
          textOverflow: 'ellipsis',
        }}
      >
        {consumable.fat.toFixed(0)}
      </TableCell>
      <TableCell
        size="small"
        padding="none"
        align="right"
        sx={{
          paddingLeft: '2ch',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          maxWidth: '6ch',
          textOverflow: 'ellipsis',
        }}
      >
        {consumable.carbohydrates.toFixed(0)}
      </TableCell>

      {isEditable && (
        <TableCell size="small" padding="none" align="right">
          <IconButton onClick={() => handleDeleteConsumable(index)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  ))

  return (
    <Paper elevation={0} variant={'elevation'}>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ padding: '0px 8px 0px 8px' }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    size="small"
                    padding="none"
                    sx={{ padding: '16px 0 16px 0px' }}
                  >
                    Item
                  </TableCell>
                  <TableCell
                    size="small"
                    padding="none"
                    align="right"
                    sx={{ padding: '16px 4px 16px 4px' }}
                  >
                    Cal
                  </TableCell>
                  <TableCell
                    size="small"
                    padding="none"
                    align="right"
                    sx={{ padding: '16px 4px 16px 4px' }}
                  >
                    Protein
                  </TableCell>
                  <TableCell
                    size="small"
                    padding="none"
                    align="right"
                    sx={{ padding: '16px 4px 16px 4px' }}
                  >
                    Fat
                  </TableCell>
                  <TableCell
                    size="small"
                    padding="none"
                    align="right"
                    sx={{ padding: '16px 4px 16px 4px' }}
                  >
                    Carbs
                  </TableCell>
                  <TableCell size="small" padding="none" align="right" />
                </TableRow>
              </TableHead>
              <TableBody>{generatedRows}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  )
}
