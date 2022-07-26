import DatePicker from '@mui/lab/DatePicker'
import { Box, Grid, LinearProgress } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useEffect, useState } from 'react'
import { EntriesContext, UserContext } from '../../app/App'
import { DailyEntryCreateNew } from '../../components'
import { DailyEntryLastDay } from '../../components/DailyEntryLastDay'
import { DailyEntryMainView } from '../../components/DailyEntryMainView/DailyEntryMainView'
import { DailyEntryMissedDay } from '../../components/DailyEntryMissedDay/DailyEntryMissedDay'
import {
  AddConsumableToDailyEntryDialog,
  UpdateDailyEntryActivityLevelDialog,
  UpdateDailyEntryWeightDialog,
} from '../../components/dialogs'
import { NewCycleDialog } from '../../components/dialogs/NewCycleDialog'
import { NewUserDialog } from '../../components/dialogs/NewUserDialog'
import { ReturningUserDialog } from '../../components/dialogs/ReturningUserDialog'
import { MobileDateView } from '../../components/MobileDateView'
import { DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { useStore } from '../../store/useStore'
import { dailyEntryPageHooks } from './hooks'

const today = DateTime.now().startOf('day')

export const DailyEntriesPage: React.FC = () => {
  const { selectedCycle } = useStore((state) => state.selectedCycleSlice)
  const cycle = selectedCycle
  const user = useContext(UserContext)
  const entries = useContext(EntriesContext)
  const { endingDate } = { ...cycle }
  const isNewUser = cycle === null
  const cycleEndDate = endingDate ? DateTime.fromISO(endingDate) : null

  const newCalendarMaxDate = cycle?.isActive ? today.startOf('day') : 1
  const getCalendarMaxDate = () => {
    if (cycle && cycle.isActive) {
      return today.startOf('day') > cycleEndDate?.startOf('day')!
        ? cycleEndDate!
        : today
    } else if (cycle && !cycle.isActive) {
      return cycleEndDate?.startOf('day').minus({ days: 1 })!
    } else {
      return today
    }
  }
  console.log({ entries })
  const calendarMaxDate = getCalendarMaxDate()
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
    if (isNewUser) {
      setOpenNewUserDialog(true)
    }
  }, [isNewUser])

  const {
    currentlySelectedDate,
    isEditable,
    isFirstDay,
    isLastEntryDay,
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
    if (pageStates.todayNoEntryReturningFromAWOL) {
      setOpenReturningUserDialog(true)
    }
    return () => setOpenReturningUserDialog(false)
  }, [pageStates.todayNoEntryReturningFromAWOL])

  useEffect(() => {
    const selectedEntry =
      entries?.find((entry) => entry.entryDate === currentlySelectedDate) ??
      null
    setDailyEntry(selectedEntry)
  }, [currentlySelectedDate, entries])

  if (!user) {
    return null
  }

  const {
    loading: pageLoading,
    todayHasEntry,
    firstDayNoEntry,
    todayNoEntry,
    todayNoEntryMissedYesterday,
    todayNoEntryReturningFromAWOL,
    previousDayNoEntry,
    awolDayNoEntry,
    lastDayNotFinalized,
    lastDayNotFinalizedMissedYesterday,
    lastDayNotFinalizedReturningFromAWOL,
  } = pageStates

  const renderPageView = () => {
    if (pageLoading) {
      return <LinearProgress />
    } else if (firstDayNoEntry || todayNoEntry || todayNoEntryMissedYesterday) {
      return (
        <DailyEntryCreateNew
          date={currentlySelectedDate!}
          daysRemaining={daysRemaining}
          cycle={cycle!}
          dataService={dataService}
          user={user}
        />
      )
    } else if (todayHasEntry) {
      return (
        <DailyEntryMainView
          dailyEntry={dailyEntry!}
          user={user}
          displayWeight={displayWeight}
          isFirstDay={isFirstDay}
          isLastDay={isLastEntryDay}
          isEditable={isEditable}
          dataService={dataService}
          activityLevel={activityLevel}
          setOpenConsumableDialog={setOpenConsumableDialog}
          setOpenUpdateWeightDialog={setOpenUpdateWeightDialog}
          setOpenUpdateActivityLevelDialog={setOpenUpdateActivityLevelDialog}
        />
      )
    } else if (awolDayNoEntry) {
      return <DailyEntryMissedDay />
    } else if (lastDayNotFinalized) {
      return (
        <DailyEntryLastDay
          date={currentlySelectedDate!}
          daysRemaining={daysRemaining}
          cycle={cycle!}
          dataService={dataService}
          user={user}
          cycleEndDate={cycleEndDate}
          setPickerDate={setPickerDate}
        />
      )
    }
  }

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
      <NewCycleDialog
        open={openNewUserDialog}
        isNewUser={isNewUser}
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
          {renderPageView()}
        </Grid>
      </Grid>
    </>
  )
}
