import { Box, Button, Grid, LinearProgress } from '@mui/material'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import React, { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { UseApi } from './UseApi'
import { DailyEntry } from '../../model/Model'
import { DailyEntryCreateNew } from '../../components'
import {
  UpdateDailyEntryWeightDialog,
  UpdateDailyEntryActivityLevelDialog,
  AddConsumableToDailyEntryDialog,
} from '../../components/dialogs'
import { CycleContext, UserContext } from '../../app/App'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { DailyEntryMetricView } from '../../components/DailyEntryMetricView'
import { formattedActivityLevel } from '../../utilities/Convert'
import { DailyEntryGaugeChart } from '../../components/DailyEntryGaugeChart/DailyEntryGaugeChart'
import { DailyEntryConsumablesTable } from '../../components/DailyEntryConsumablesTable/DailyEntryConsumablesTable'
import { Calculate } from '../../utilities/Calculate'
import { MobileDateView } from '../../components/MobileDateView'
import { DailyEntryMainView } from '../../components/DailyEntryMainView/DailyEntryMainView'
import { DailyEntryMissedDay } from '../../components/DailyEntryMissedDay/DailyEntryMissedDay'

const today = DateTime.now()

export const DailyEntriesPage: React.FC = () => {
  const user = useContext(UserContext)

  const cycle = useContext(CycleContext)
  const [pickerDate, setPickerDate] = useState<DateTime>(today)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [openConsumableDialog, setOpenConsumableDialog] = React.useState(false)
  const [openUpdateWeightDialog, setOpenUpdateWeightDialog] =
    React.useState(false)
  const [openUpdateActivityLevelDialog, setOpenUpdateActivityLevelDialog] =
    React.useState(false)

  const cycleStartDate = DateTime.fromISO(cycle?.startDate!)
  const currentlySelectedDate = pickerDate?.toISODate()?.split('-')?.join('')
  const isFirstDay = cycle?.startDate === currentlySelectedDate
  const useApi = new UseApi(
    user?.user!,
    user?.sub!,
    cycle?.cycleId!,
    currentlySelectedDate,
    dailyEntry,
    setDailyEntry
  )
  const { matchesMD } = useMediaQueries()
  const calculate = new Calculate()
  useEffect(() => {
    setLoading(true)
    useApi.fetchPageData(setLoading, setDailyEntry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlySelectedDate])
  //Plan is to fetch the previous day and now allow the current day to set a weight thats more than 10lbs or so different.
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
      useApi={useApi}
      sub={user?.sub!}
      setLoading={setLoading}
      setDailyEntry={setDailyEntry}
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
      {!matchesMD && (
        <MobileDateView
          pickerDate={pickerDate}
          minDate={cycleStartDate}
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
            maxDate={today}
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
          {loading && <LinearProgress />}
          {!loading && mainContent}
          {!loading && newDayNoEntry}
          {!loading && missedDay}
        </Grid>
      </Grid>
    </>
  )
}
