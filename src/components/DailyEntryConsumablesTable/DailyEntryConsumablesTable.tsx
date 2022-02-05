import {
  TableContainer,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import React from 'react'
import { EntryConsumable } from '../../model/Model'
import { UseApi } from '../../pages/DailyEntriesPage/UseApi'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  rows: EntryConsumable[] | []
  useApi: UseApi
  handleOpenAddConsumableDialog: () => void
}

export const DailyEntryConsumablesTable: React.FC<Props> = ({
  rows,
  useApi,
  handleOpenAddConsumableDialog,
}) => {
  const { matchesMD } = useMediaQueries()
  const generatedRows = rows?.map((row, index) => (
    <TableRow
      key={`${row.name} + ${index}`}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell
        component="th"
        size="small"
        padding="none"
        scope="row"
        sx={{ paddingLeft: '16px' }}
      >
        {row.name}
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
        {row.calories.toFixed(0)}
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
        {row.protein.toFixed(0)}
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
        {row.fat.toFixed(0)}
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
        {row.carbohydrates.toFixed(0)}
      </TableCell>
      <TableCell size="small" padding="none" align="right">
        <IconButton onClick={() => useApi.deleteConsumable(index, rows)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))

  return (
    <Paper elevation={0} variant={matchesMD ? 'outlined' : 'elevation'}>
      <Grid container>
        {/* <Grid
          container
          item
          xs={12}
          justifyContent="space-between"
          alignItems="center"
          sx={{ backgroundColor: '#81d4fa' }}
        >
          <Grid item xs={5}>
            <Typography variant="h6" sx={{ paddingLeft: '1rem' }}>
              Food Details
            </Typography>
          </Grid>
          {/* <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            item
            xs={7}
          >
            <Typography>Add Consumable</Typography>
            <IconButton
              color="primary"
              aria-label="add consumable"
              onClick={handleOpenAddConsumableDialog}
            >
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Grid> */}
        {/* </Grid> */}
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    size="small"
                    padding="none"
                    sx={{ padding: '16px 0 16px 16px' }}
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
                  <TableCell
                    size="small"
                    padding="none"
                    align="right"
                  ></TableCell>
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
