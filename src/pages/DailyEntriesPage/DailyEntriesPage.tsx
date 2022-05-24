import DatePicker from '@mui/lab/DatePicker'
import { Box, Grid, LinearProgress } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useEffect, useState } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { DailyEntryCreateNew } from '../../components'
import { DailyEntryLastDay } from '../../components/DailyEntryLastDay'
import { DailyEntryMainView } from '../../components/DailyEntryMainView/DailyEntryMainView'
import { DailyEntryMissedDay } from '../../components/DailyEntryMissedDay/DailyEntryMissedDay'
import {
  AddConsumableToDailyEntryDialog,
  UpdateDailyEntryActivityLevelDialog,
  UpdateDailyEntryWeightDialog,
} from '../../components/dialogs'
import { NewUserDialog } from '../../components/dialogs/NewUserDialog'
import { ReturningUserDialog } from '../../components/dialogs/ReturningUserDialog'
import { MobileDateView } from '../../components/MobileDateView'
import { DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { dailyEntryPageHooks } from './hooks'

const today = DateTime.now().startOf('day')
// const today = DateTime.fromISO('20220517')

export const DailyEntriesPage: React.FC = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const { endingDate } = { ...cycle }
  const cycleEndDate = endingDate ? DateTime.fromISO(endingDate) : null
  const calendarMaxDate =
    cycleEndDate && today.startOf('day') > cycleEndDate?.startOf('day')
      ? cycleEndDate
      : today
  const [pickerDate, setPickerDate] = useState<DateTime>(calendarMaxDate)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null)
  const [openNewUserDialog, setOpenNewUserDialog] = React.useState(false)
  const [openReturningUserDialog, setOpenReturningUserDialog] =
    React.useState(false)
  const [openConsumableDialog, setOpenConsumableDialog] = React.useState(false)
  const [openUpdateWeightDialog, setOpenUpdateWeightDialog] =
    React.useState(false)
  const [openUpdateActivityLevelDialog, setOpenUpdateActivityLevelDialog] =
    React.useState(false)
  const dataService = new DataService()

  dataService.setUser(user?.user!)
  useEffect(() => {
    if (cycle === null) {
      setOpenNewUserDialog(true)
    }
  }, [cycle])

  const {
    currentlySelectedDate,
    isEditable,
    isFirstDay,
    isLastDay,
    userAwaySeveralDays,
    daysSinceLastActive,
    cycleStartDate,
    daysRemaining,
    deficitPerDay,
    bmr,
    displayWeight,
    activityLevel,
    sortedEntries,
    pageStates,
  } = dailyEntryPageHooks({ pickerDate, cycle, entries, dailyEntry, user })

  useEffect(() => {
    if (!isFirstDay && cycle?.isActive && userAwaySeveralDays) {
      setOpenReturningUserDialog(true)
    }
    return () => setOpenReturningUserDialog(false)
  }, [cycle?.isActive, isFirstDay, userAwaySeveralDays])

  useEffect(() => {
    const selectedEntry =
      entries?.find((entry) => entry.entryDate === currentlySelectedDate) ??
      null
    setDailyEntry(selectedEntry)
  }, [currentlySelectedDate, entries])

  if (!user) {
    return null
  }

  const mainContent = dailyEntry && (
    <DailyEntryMainView
      dailyEntry={dailyEntry}
      user={user}
      displayWeight={displayWeight}
      isFirstDay={isFirstDay}
      isLastDay={isLastDay}
      isEditable={isEditable}
      dataService={dataService}
      activityLevel={activityLevel}
      setOpenConsumableDialog={setOpenConsumableDialog}
      setOpenUpdateWeightDialog={setOpenUpdateWeightDialog}
      setOpenUpdateActivityLevelDialog={setOpenUpdateActivityLevelDialog}
    />
  )

  const newDayNoEntry = isEditable &&
    !dailyEntry &&
    cycle?.isActive &&
    !openNewUserDialog &&
    !isLastDay && (
      <DailyEntryCreateNew
        date={currentlySelectedDate!}
        daysRemaining={daysRemaining}
        cycle={cycle}
        dataService={dataService}
        user={user}
      />
    )

  const finalWeighIn = pageStates.lastDayNotFinalized && (
    <DailyEntryLastDay
      date={currentlySelectedDate!}
      daysRemaining={daysRemaining}
      cycle={cycle!}
      dataService={dataService}
      user={user}
    />
  )

  const missedDay = pageStates.awolDayNoEntry && <DailyEntryMissedDay />
  console.log(entries)
  return (
    <>
      <UpdateDailyEntryWeightDialog
        entry={dailyEntry!}
        goalWeight={cycle?.goalWeight!}
        daysRemaining={daysRemaining}
        user={user}
        dataService={dataService}
        open={openUpdateWeightDialog}
        setDialogOpenState={setOpenUpdateWeightDialog}
      />
      <UpdateDailyEntryActivityLevelDialog
        entry={dailyEntry!}
        deficitPerDay={deficitPerDay}
        bmr={bmr}
        dataService={dataService}
        open={openUpdateActivityLevelDialog}
        setDialogOpenState={setOpenUpdateActivityLevelDialog}
      />
      <AddConsumableToDailyEntryDialog
        entry={dailyEntry!}
        dataService={dataService}
        open={openConsumableDialog}
        setDialogOpenState={setOpenConsumableDialog}
      />
      <NewUserDialog
        open={openNewUserDialog}
        user={user!}
        dataService={dataService}
        setDialogOpenState={setOpenNewUserDialog}
      />
      <ReturningUserDialog
        open={openReturningUserDialog}
        cycle={cycle}
        dataService={dataService}
        entries={sortedEntries}
        daysSinceLastActive={daysSinceLastActive}
        setDialogOpenState={setOpenReturningUserDialog}
      />
      <MobileDateView
        pickerDate={pickerDate}
        minDate={cycleStartDate}
        maxDate={calendarMaxDate}
        setPickerDate={setPickerDate}
        setDatePickerOpen={setDatePickerOpen}
      />
      <Grid container>
        <Grid item xs={12} container justifyContent="center">
          <DatePicker
            value={pickerDate}
            minDate={cycleStartDate}
            maxDate={calendarMaxDate}
            open={datePickerOpen}
            onOpen={() => setDatePickerOpen(true)}
            onClose={() => setDatePickerOpen(false)}
            onChange={() => null}
            onAccept={(newValue) => {
              if (newValue) {
                setPickerDate(newValue)
              }
            }}
            renderInput={({ inputRef, inputProps, InputProps }) => (
              <Box ref={inputRef}></Box>
            )}
          />
        </Grid>
        <Grid item xs={12} id="dailyEntryMainContentContainer">
          {entries === null && <LinearProgress />}
          {entries !== null && mainContent}
          {entries !== null && newDayNoEntry}
          {entries !== null && finalWeighIn}
          {entries !== null && missedDay}
        </Grid>
      </Grid>
    </>
  )
}
