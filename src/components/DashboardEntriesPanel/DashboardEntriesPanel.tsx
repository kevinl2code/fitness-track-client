import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { DailyEntry, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { formattedActivityLevel } from '../../utilities/Convert'
import { Sort } from '../../utilities/Sort'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { ListSection, ListSectionDetails } from '../ListSection/ListSection'

interface Props {
  entries: DailyEntry[]
  user: UserState
}

interface RowProps {
  entry: DailyEntry
}

export const DashboardEntriesPanel: React.FC<Props> = ({ entries, user }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { birthday, sex, height } = user
  const calculate = new Calculate()
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries).reverse()
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const renderActivity = {
    SEDENTARY: <AirlineSeatReclineNormalIcon fontSize="small" />,
    LIGHTLY_ACTIVE: <DirectionsRunIcon fontSize="small" />,
    MODERATELY_ACTIVE: (
      <>
        <DirectionsRunIcon fontSize="small" />
        <DirectionsRunIcon fontSize="small" />
      </>
    ),
    VERY_ACTIVE: (
      <>
        <DirectionsRunIcon fontSize="small" />
        <DirectionsRunIcon fontSize="small" />
        <DirectionsRunIcon fontSize="small" />
      </>
    ),
    EXTRA_ACTIVE: (
      <>
        <DirectionsRunIcon fontSize="small" />
        <DirectionsRunIcon fontSize="small" />
        <DirectionsRunIcon fontSize="small" />
        <DirectionsRunIcon fontSize="small" />
      </>
    ),
  }

  const Row: React.FC<RowProps> = ({ entry }) => {
    const [open, setOpen] = React.useState(false)
    const {
      dailyEntryActivityLevel,
      entryDate,
      dailyEntryWeight,
      dailyEntryConsumables,
    } = entry

    const bmr = calculate.BMR(
      height,
      dailyEntryWeight,
      calculate.age(birthday!),
      sex
    )
    const tdee = calculate.TDEE(bmr, dailyEntryActivityLevel)

    const confirmedConsumables =
      dailyEntryConsumables.length > 0 ? dailyEntryConsumables : null

    const caloriesConsumed =
      confirmedConsumables?.reduce(
        (acc, consumable) => acc + consumable.calories,
        0
      ) || 0

    const relativeCalories = caloriesConsumed - tdee

    const EntryData: React.FC = () => {
      const proteinConsumed =
        confirmedConsumables?.reduce(
          (acc, consumable) => acc + consumable.protein,
          0
        ) || 0
      const fatConsumed =
        confirmedConsumables?.reduce(
          (acc, consumable) => acc + consumable.fat,
          0
        ) || 0
      const carbohydratesConsumed =
        confirmedConsumables?.reduce(
          (acc, consumable) => acc + consumable.carbohydrates,
          0
        ) || 0

      // Hard to find general consensus on this.  Not going to include for time being
      // const proteinRequired = calculate.proteinRequiredForWeightLoss(
      //   dailyEntryWeight,
      //   dailyEntryActivityLevel
      // )
      // const proteinInRange =
      //   proteinRequired.minimum < proteinConsumed &&
      //   proteinConsumed < proteinRequired.maximum

      const detailsSection: ListSectionDetails[] = [
        {
          itemName: 'Calories Consumed',
          secondaryText: Math.round(caloriesConsumed).toString(),
        },
        {
          itemName: 'Calories Burned',
          secondaryText: tdee.toString(),
        },
        {
          itemName: 'Activity Level',
          secondaryText: formattedActivityLevel[dailyEntryActivityLevel],
        },
      ]
      const macroNutrientsSection: ListSectionDetails[] = [
        {
          itemName: 'Protein',
          secondaryText: Math.round(proteinConsumed).toString(),
        },
        {
          itemName: 'Fat',
          secondaryText: Math.round(fatConsumed).toString(),
        },
        {
          itemName: 'Carbohydrates',
          secondaryText: Math.round(carbohydratesConsumed).toString(),
        },
      ]

      return (
        <Box sx={{ margin: 1 }}>
          <ListSection
            sectionSubHeader="Summary"
            sectionItems={detailsSection}
            justify="center"
            dense={true}
          />
          <ListSection
            sectionSubHeader="MacroNutrients"
            sectionItems={macroNutrientsSection}
            justify="center"
            dense={true}
          />
        </Box>
      )
    }
    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'none' } }}>
          <TableCell padding="none" sx={{ borderBottom: 'none' }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            sx={{ paddingLeft: '0px', borderBottom: 'none' }}
          >
            {DateTime.fromISO(entryDate).toFormat('MMM dd')}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: 'none' }}>
            {renderActivity[dailyEntryActivityLevel]}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: 'none' }}>{`${Math.round(
            relativeCalories
          )} cals`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <EntryData />
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  const generatedRows = sortedEntries
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((entry, index) => {
      return <Row entry={entry} key={`row-${index}`} />
    })

  return (
    <Grid item md={8} xs={12}>
      <Paper
        elevation={0}
        variant={'elevation'}
        sx={{ padding: '2rem 8px 1rem 8px' }}
      >
        <Typography
          sx={{ marginBottom: 1, color: 'primary.main' }}
          align="center"
          fontWeight={700}
          fontSize="1.5rem"
        >
          Entry Log
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <TableContainer component={Paper} elevation={0}>
              <Table
                // sx={{ minWidth: 650 }}
                size="small"
                aria-label="food-items-table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: '10%',
                        paddingLeft: '0px',
                        paddingRight: '0px',
                      }}
                    />
                    <TableCell sx={{ paddingLeft: '0px' }}>Date</TableCell>
                    <TableCell sx={{ paddingLeft: '0px' }} align="right">
                      Activity Level
                    </TableCell>
                    <TableCell sx={{ paddingLeft: '0px' }} align="right">
                      Relative Calories
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{generatedRows}</TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={entries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={[
                {
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: '6px',
                    paddingRight: '0px',
                  },
                  '& .MuiTablePagination-actions': {
                    marginLeft: '12px',
                  },
                },
              ]}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}
