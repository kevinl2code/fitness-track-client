import DatePicker from '@mui/lab/DatePicker'
import { Box, Container, Grid } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useState } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { UpdateGoalWeightDialog } from '../../components/dialogs/UpdateGoalWeightDialog'
import { PlanPageMainView } from '../../components/PlanPageMainView'
import { DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { Sort } from '../../utilities/Sort'

interface Props {}

export const PlanPage: React.FC<Props> = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const cycleEndDate = DateTime.fromISO(cycle?.endingDate!)
  const [pickerDate, setPickerDate] = useState<DateTime>(cycleEndDate)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [openUpdateGoalWeightDialog, setOpenUpdateGoalWeightDialog] =
    React.useState(false)
  const dataService = new DataService()
  dataService.setUser(user?.user!)
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries)

  const cycleStartDate = DateTime.fromISO(cycle?.startDate!)
  const calendarMaxDate = cycleStartDate.plus({ days: 90 })

  const today = DateTime.now().startOf('day')
  const todayEntry =
    sortedEntries.reverse()[0].entryDate ===
    today.toISODate()?.split('-')?.join('')
      ? sortedEntries[0]
      : null

  if (!user || !cycle) {
    return null
  }

  return (
    <>
      <UpdateGoalWeightDialog
        entry={todayEntry}
        cycle={cycle}
        user={user}
        open={openUpdateGoalWeightDialog}
        setDialogOpenState={setOpenUpdateGoalWeightDialog}
        dataService={dataService}
      />
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
            setOpenUpdateGoalWeightDialog={setOpenUpdateGoalWeightDialog}
          />
        )}
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
