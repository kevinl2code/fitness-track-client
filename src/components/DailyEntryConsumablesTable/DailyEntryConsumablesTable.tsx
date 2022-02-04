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
      <TableCell component="th" scope="row">
        {row.name}
      </TableCell>
      <TableCell align="right">{row.calories}</TableCell>
      <TableCell align="right">{row.protein}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => useApi.deleteConsumable(index, rows)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))

  return (
    <Paper elevation={0} variant={matchesMD ? 'outlined' : 'elevation'}>
      <Grid container>
        <Grid
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
          <Grid
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
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell width="50%">Consumable</TableCell>
                  <TableCell width="20%" align="right">
                    Calories
                  </TableCell>
                  <TableCell width="20%" align="right">
                    Protein&nbsp;(g)
                  </TableCell>
                  <TableCell width="10%" align="right"></TableCell>
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
