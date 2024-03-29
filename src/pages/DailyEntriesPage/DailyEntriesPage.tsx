import DatePicker from '@mui/lab/DatePicker'
import { Box, Grid, LinearProgress } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useEffect, useState } from 'react'
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
import { ReturningUserDialog } from '../../components/dialogs/ReturningUserDialog'
import { MobileDateView } from '../../components/MobileDateView'
import { PageLayout } from '../../layouts/PageLayout'
import { DailyEntry } from '../../model/Model'
import { dataService } from '../../app/App'
import { useStore } from '../../store/useStore'
import { dailyEntryPageHooks } from './hooks'

const today = DateTime.now().startOf('day')

export const DailyEntriesPage: React.FC = () => {
  const { selectedCycle } = useStore((state) => state.selectedCycleSlice)
  const { entries } = useStore((state) => state.entriesSlice)
  const { userData } = useStore((state) => state.userSlice)
  const cycle = selectedCycle
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

  // dataService.setUser(userData?.user!)
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
  } = dailyEntryPageHooks({
    pickerDate,
    cycle,
    entries,
    dailyEntry,
    user: userData,
  })

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

  if (!userData) {
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
    } else if (
      firstDayNoEntry ||
      todayNoEntry ||
      todayNoEntryMissedYesterday ||
      previousDayNoEntry
    ) {
      return (
        <DailyEntryCreateNew
          date={currentlySelectedDate!}
          daysRemaining={daysRemaining}
          cycle={cycle!}
          user={userData}
        />
      )
    } else if (todayHasEntry) {
      return (
        <DailyEntryMainView
          dailyEntry={dailyEntry!}
          user={userData}
          displayWeight={displayWeight}
          isFirstDay={isFirstDay}
          isLastDay={isLastEntryDay}
          isEditable={isEditable}
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
          user={userData}
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
        user={userData}
        open={openUpdateWeightDialog}
        setDialogOpenState={setOpenUpdateWeightDialog}
      />
      <UpdateDailyEntryActivityLevelDialog
        entry={dailyEntry!}
        deficitPerDay={deficitPerDay}
        bmr={bmr}
        open={openUpdateActivityLevelDialog}
        setDialogOpenState={setOpenUpdateActivityLevelDialog}
      />
      <AddConsumableToDailyEntryDialog
        entry={dailyEntry!}
        open={openConsumableDialog}
        setDialogOpenState={setOpenConsumableDialog}
      />
      <NewCycleDialog
        open={openNewUserDialog}
        isNewUser={isNewUser}
        user={userData}
        setDialogOpenState={setOpenNewUserDialog}
      />
      <ReturningUserDialog
        open={openReturningUserDialog}
        cycle={cycle}
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
      <PageLayout>
        <PageLayout.Header>
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
        </PageLayout.Header>
        <PageLayout.Content>{renderPageView() ?? <></>}</PageLayout.Content>
      </PageLayout>
    </>
  )
}
