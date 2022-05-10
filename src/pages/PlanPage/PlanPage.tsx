import DatePicker from '@mui/lab/DatePicker'
import { Box, Container, Grid } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useState } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { PlanPageMainView } from '../../components/PlanPageMainView'
import { DailyEntry } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { Sort } from '../../utilities/Sort'

interface Props {}

export const PlanPage: React.FC<Props> = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const calculate = new Calculate()
  const convert = new Convert()
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries)

  const cycleEndDate = DateTime.fromISO(cycle?.endingDate!)

  const cycleStartDate = DateTime.fromISO(cycle?.startDate!)
  const calendarMaxDate = cycleStartDate.plus({ days: 90 })
  const [pickerDate, setPickerDate] = useState<DateTime>(cycleEndDate)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  // const cyckeType = cycle?.cycleType

  return (
    <>
      <Grid item xs={12} container justifyContent="center">
        <DatePicker
          value={pickerDate}
          minDate={cycleStartDate}
          maxDate={calendarMaxDate}
          open={datePickerOpen}
          onOpen={() => setDatePickerOpen(true)}
          onClose={() => setDatePickerOpen(false)}
          onChange={(newValue) => {
            if (newValue) {
              setPickerDate(newValue)
            }
          }}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box ref={inputRef}></Box>
          )}
        />
      </Grid>
      <Container>
        {cycle !== null && (
          <PlanPageMainView
            cycle={cycle}
            sortedEntries={sortedEntries}
            setDatePickerOpen={setDatePickerOpen}
          />
        )}
        {/* <Grid
          container
          direction="column"
          alignItems="center"
          sx={{ marginTop: '1rem', width: '100%' }}
        >
          <Grid item>
            <Typography variant="h4">GOAL</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">{goalText[cycleType]}</Typography>
          </Grid>
          <Divider sx={{ width: '90%', marginTop: '1rem' }} />
          <ListSection
            sectionSubHeader="Dates"
            sectionItems={dateSection}
            justify="center"
          />
          <ListSection
            sectionSubHeader="Key Weights"
            sectionItems={weightSection}
            justify="center"
          />
          <ListSection
            sectionSubHeader="Milestones"
            sectionItems={mileStoneSection}
            justify="center"
          />
        </Grid> */}
      </Container>
    </>
    //   {status.pastTense !== 'maintained' && (
    //     <PlanDetail
    //       text={`Pounds ${status.pastTense}:`}
    //       value={(Math.round(Math.abs(weightChanged) * 10) / 10).toFixed(1)}
    //     />
    //   )}
    //   {cycleType !== 'MAINTAIN' && (
    //     <PlanDetail
    //       text={'Pounds to go:'}
    //       value={currentWeight ? (currentWeight - goalWeight).toFixed(1) : '-'}
    //     />
    //   )}
  )
}
