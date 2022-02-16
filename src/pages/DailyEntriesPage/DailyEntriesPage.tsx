import { Box, Grid, LinearProgress } from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import React, { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { UseApi } from './UseApi'
import { Cycle, DailyEntry } from '../../model/Model'
import { DailyEntryCreateNew } from '../../components'
import {
  UpdateDailyEntryWeightDialog,
  UpdateDailyEntryActivityLevelDialog,
  AddConsumableToDailyEntryDialog,
} from '../../components/dialogs'
import { CycleContext, UserContext, EntriesContext } from '../../app/App'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { formattedActivityLevel } from '../../utilities/Convert'
import { Calculate } from '../../utilities/Calculate'
import { MobileDateView } from '../../components/MobileDateView'
import { DailyEntryMainView } from '../../components/DailyEntryMainView/DailyEntryMainView'
import { DailyEntryMissedDay } from '../../components/DailyEntryMissedDay/DailyEntryMissedDay'
import { DataService } from '../../services/DataService'
import { NewUserDialog } from '../../components/dialogs/NewUserDialog'
import { ReturningUserDialog } from '../../components/dialogs/ReturningUserDialog'
import { Sort } from '../../utilities/Sort'

interface Props {
  setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
}

const today = DateTime.now().startOf('day')

export const DailyEntriesPage: React.FC<Props> = ({ setCycleContext }) => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const cycleEndDate = cycle?.endingDate
    ? DateTime.fromISO(cycle?.endingDate)
    : null
  const calendarMaxDate = cycleEndDate ?? today
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
  const lastEntryDate = DateTime.fromISO(sortedEntries[0].entryDate).startOf(
    'day'
  )

  const daysSinceLastActive = Math.floor(today.diff(lastEntryDate, 'days').days)

  const userAwayOneDay = daysSinceLastActive === 1
  const userAwaySeveralDays = daysSinceLastActive > 2

  const isFirstDay = cycle?.startDate === currentlySelectedDate
  console.log(daysSinceLastActive)
  useEffect(() => {
    if (!isFirstDay && cycle?.isActive && userAwaySeveralDays) {
      setOpenReturningUserDialog(true)
    }
  }, [cycle?.isActive, isFirstDay, userAwaySeveralDays])

  const useApi = new UseApi(
    user?.user!,
    user?.sub!,
    cycle?.cycleId!,
    currentlySelectedDate,
    dailyEntry,
    setDailyEntry
  )

  useEffect(() => {
    const selectedEntry =
      entries?.find((entry) => entry.entryDate === currentlySelectedDate) ??
      null
    setDailyEntry(selectedEntry)
  }, [currentlySelectedDate, entries])

  const { matchesMD } = useMediaQueries()
  const calculate = new Calculate()

  if (!user) {
    return null
  }
  const { dailyEntryWeight, dailyEntryActivityLevel, dailyEntryConsumables } =
    { ...dailyEntry } || {}
  const start = DateTime.fromISO(cycle?.startDate!)
  const currentDay = pickerDate
  const daysSinceStart = Math.floor(currentDay.diff(start, 'days').days)
  const daysRemaining = cycle?.duration! - daysSinceStart
  const poundsToGo = dailyEntry?.dailyEntryWeight! - cycle?.goalWeight!
  const caloriesToGo = poundsToGo * 3500
  const deficitPerDay = caloriesToGo / daysRemaining
  const { birthday, sex, height } = user
  const age = calculate.age(birthday)
  // const bmr = calculate.BMR(height, dailyEntryWeight, age, sex)
  // const tdee = calculate.TDEE(bmr!, dailyEntryActivityLevel)
  // const confirmedConsumables =
  //   dailyEntryConsumables?.length > 0 ? dailyEntryConsumables : null
  // const caloriesConsumed =
  //   confirmedConsumables?.reduce(
  //     (acc, consumable) => acc + consumable.calories,
  //     0
  //   ) || 0
  // const remainingCals = parseInt(tdee) - caloriesConsumed

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
      isEditable={isEditable}
      useApi={useApi}
      activityLevel={activityLevel}
      setOpenConsumableDialog={setOpenConsumableDialog}
      setOpenUpdateWeightDialog={setOpenUpdateWeightDialog}
      setOpenUpdateActivityLevelDialog={setOpenUpdateActivityLevelDialog}
    />
  )
  const newDayNoEntry = isEditable && !dailyEntry && (
    <DailyEntryCreateNew
      date={currentlySelectedDate!}
      cycle={cycle}
      dataService={dataService}
      // refetchEntries={refetchEntries}
      sub={user?.sub!}
    />
  )

  const missedDay = !isEditable && !dailyEntry && <DailyEntryMissedDay />

  return (
    <>
      <UpdateDailyEntryWeightDialog
        entry={dailyEntry!}
        open={openUpdateWeightDialog}
        useApi={useApi}
        setDialogOpenState={setOpenUpdateWeightDialog}
      />
      <UpdateDailyEntryActivityLevelDialog
        entry={dailyEntry!}
        open={openUpdateActivityLevelDialog}
        useApi={useApi}
        setDialogOpenState={setOpenUpdateActivityLevelDialog}
      />
      <AddConsumableToDailyEntryDialog
        entry={dailyEntry!}
        open={openConsumableDialog}
        useApi={useApi}
        setDialogOpenState={setOpenConsumableDialog}
      />
      <NewUserDialog
        open={openNewUserDialog}
        user={user!}
        dataService={dataService}
        setCycleContext={setCycleContext}
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
      {!matchesMD && (
        <MobileDateView
          pickerDate={pickerDate}
          minDate={cycleStartDate}
          maxDate={calendarMaxDate}
          setPickerDate={setPickerDate}
          setDatePickerOpen={setDatePickerOpen}
        />
      )}
      <Grid container sx={[matchesMD && { marginTop: '2rem' }]}>
        <Grid item xs={12} md={4} container justifyContent="flex-start">
          {/* <Grid item xs={12} sx={{ marginBottom: '2rem' }}> */}
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
            renderInput={
              matchesMD
                ? (params) => <TextField {...params} />
                : ({ inputRef, inputProps, InputProps }) => (
                    <Box ref={inputRef}>
                      {/* <Typography>{pickerDate?.toISODate}</Typography> */}
                      {/* {InputProps?.endAdornment} */}
                    </Box>
                  )
            }
          />
          {/* </Grid> */}
        </Grid>
        <Grid item xs={12} md={8} id="dailyEntryMainContentContainer">
          {/* {dailyEntriesLoading && <LinearProgress />}
          {!dailyEntriesLoading && mainContent}
          {!dailyEntriesLoading && newDayNoEntry}
          {!dailyEntriesLoading && missedDay} */}
          {entries === null && <LinearProgress />}
          {entries !== null && mainContent}
          {entries !== null && newDayNoEntry}
          {entries !== null && missedDay}
        </Grid>
      </Grid>
    </>
  )
}
