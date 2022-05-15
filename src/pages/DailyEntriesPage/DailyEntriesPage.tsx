import DatePicker from '@mui/lab/DatePicker'
import { Box, Grid, LinearProgress } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useEffect, useState } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { DailyEntryCreateNew } from '../../components'
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
import { Calculate } from '../../utilities/Calculate'
import { formattedActivityLevel } from '../../utilities/Convert'
import { Sort } from '../../utilities/Sort'

const today = DateTime.now().startOf('day')

export const DailyEntriesPage: React.FC = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const { startingWeight, endingWeight, endingDate } = { ...cycle }
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

  const cycleStartDate = DateTime.fromISO(cycle?.startDate!)

  const currentlySelectedDate = pickerDate?.toISODate()?.split('-')?.join('')
  const sort = new Sort()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries).reverse()
  const lastEntryDate = DateTime.fromISO(sortedEntries[0]?.entryDate).startOf(
    'day'
  )

  //TODO IMPLEMENT THIS FOR USER AWAY FLOW. IF THEY NEVER WEIGHED IN, JUST CLOSE THE CYCLE AND MAKE THEM START ANEW
  const cycleHasEntries = entries.length > 0
  const userNeverWeighedIn =
    !cycleHasEntries && Math.floor(today.diff(cycleStartDate, 'days').days) > 2
  const daysSinceLastActive = Math.floor(today.diff(lastEntryDate, 'days').days)

  const userAwayOneDay = daysSinceLastActive === 1
  const userAwaySeveralDays = daysSinceLastActive > 2

  const isFirstDay = cycle?.startDate === currentlySelectedDate
  const isLastDay = cycle?.endingDate === currentlySelectedDate
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

  const calculate = new Calculate()

  if (!user) {
    return null
  }
  const { dailyEntryWeight, dailyEntryActivityLevel } = { ...dailyEntry } || {}
  const cycleStart = DateTime.fromISO(cycle?.startDate!)
  const currentDay = pickerDate
  const daysSinceStart = Math.floor(currentDay.diff(cycleStart, 'days').days)
  const planDuration = calculate.planDuration(
    cycle?.startDate!,
    cycle?.endingDate!
  )
  const daysRemaining = planDuration - daysSinceStart
  const poundsToGo = dailyEntry?.dailyEntryWeight! - cycle?.goalWeight!
  const caloriesToGo = poundsToGo * 3500
  const deficitPerDay = caloriesToGo / daysRemaining
  const { birthday, sex, height } = user
  const age = calculate.age(birthday)
  const bmr = calculate.BMR(height, dailyEntryWeight!, age, sex)
  // const startingBMR = calculate.BMR(height, startingWeight!, age, sex)
  // const endingBMR = calculate.BMR(height, endingWeight!, age, sex)
  // const averageBMR = (startingBMR + endingBMR) / 2
  // console.log(targetCalories)
  // const confirmedConsumables =
  //   dailyEntryConsumables?.length > 0 ? dailyEntryConsumables : null
  // const caloriesConsumed =
  //   confirmedConsumables?.reduce(
  //     (acc, consumable) => acc + consumable.calories,
  //     0
  //   ) || 0
  // const remainingCals = tdee - caloriesConsumed

  const displayWeight = dailyEntry?.dailyEntryWeight || '-'
  const activityLevel = dailyEntry?.dailyEntryActivityLevel
    ? formattedActivityLevel[dailyEntry?.dailyEntryActivityLevel]
    : '-'

  const isEditable =
    pickerDate.minus({ days: 1 }).startOf('day').valueOf() ===
      today.minus({ days: 1 }).startOf('day').valueOf() ||
    pickerDate.startOf('day').valueOf() ===
      today.minus({ days: 1 }).startOf('day').valueOf()

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
    cycle &&
    !openNewUserDialog && (
      <DailyEntryCreateNew
        date={currentlySelectedDate!}
        daysRemaining={daysRemaining}
        cycle={cycle}
        dataService={dataService}
        user={user}
      />
    )

  const missedDay = !isEditable && !dailyEntry && <DailyEntryMissedDay />

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
        <Grid item xs={12} id="dailyEntryMainContentContainer">
          {entries === null && <LinearProgress />}
          {entries !== null && mainContent}
          {entries !== null && newDayNoEntry}
          {entries !== null && missedDay}
        </Grid>
      </Grid>
    </>
  )
}
