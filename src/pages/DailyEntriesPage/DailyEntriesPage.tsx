import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import TodayIcon from '@mui/icons-material/Today'
import TextField from '@mui/material/TextField'
import DatePicker from '@mui/lab/DatePicker'
import React, { useContext, useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { UseApi } from './UseApi'
import { DailyEntry } from '../../model/Model'
import { DailyEntryMealsTable, DailyEntryCreateNew } from '../../components'
import {
  UpdateDailyEntryWeightDialog,
  UpdateDailyEntryActivityLevelDialog,
  AddMealToDailyEntryDialog,
} from '../../components/dialogs'
import { CycleContext, UserContext } from '../../app/App'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { DailyEntryMetricView } from '../../components/DailyEntryMetricView'
import { formattedActivityLevel } from '../../utilities/Convert'
import { DailyEntryGaugeChart } from '../../components/DailyEntryGaugeChart/DailyEntryGaugeChart'

const today = DateTime.now()

export const DailyEntriesPage: React.FC = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const [pickerDate, setPickerDate] = useState<DateTime | null>(today)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [openMealDialog, setOpenMealDialog] = React.useState(false)
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
    currentlySelectedDate,
    dailyEntry,
    setDailyEntry
  )
  const { matchesMD } = useMediaQueries()

  //Plan is to fetch the previous day and now allow the current day to set a weight thats more than 10lbs or so different.

  useEffect(() => {
    setLoading(true)
    useApi.fetchPageData(setLoading, setDailyEntry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlySelectedDate])

  const weight = dailyEntry?.dailyEntryWeight || '-'
  const activityLevel = dailyEntry?.dailyEntryActivityLevel
    ? formattedActivityLevel[dailyEntry?.dailyEntryActivityLevel]
    : '-'

  const mobileDateViewStartPosition =
    document.getElementById('dailyEntryPageMobileDateView')?.getClientRects()[0]
      .top! - 1

  const stepDateBack = () => {
    if (!pickerDate) {
      return null
    }
    if (pickerDate.valueOf() === cycleStartDate.valueOf()) {
      return null
    }
    setPickerDate(pickerDate?.minus({ days: 1 }))
  }
  const stepDateForward = () => {
    if (!pickerDate) {
      return null
    }
    if (pickerDate.valueOf() === today.valueOf()) {
      return null
    }
    setPickerDate(pickerDate?.plus({ days: 1 }))
  }

  const mobileDateView = (
    <Paper
      square
      id="dailyEntryPageMobileDateView"
      sx={{
        width: '100%',
        backgroundColor: 'primary.main',
        border: 'none',
        padding: '1rem 1rem 0 1rem',
        position: 'sticky',
        top: mobileDateViewStartPosition,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Grid container justifyContent="space-between">
        <IconButton aria-label="delete" size="small" onClick={stepDateBack}>
          <NavigateBeforeIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography
          color={'white'}
          variant="h5"
          onClick={() => setDatePickerOpen(true)}
        >
          {pickerDate?.toFormat('MMMM dd')}
        </Typography>
        <IconButton aria-label="delete" size="small" onClick={stepDateForward}>
          <NavigateNextIcon sx={{ color: 'white' }} />
        </IconButton>
      </Grid>
    </Paper>
  )

  const mainContent = dailyEntry ? (
    <>
      <DailyEntryGaugeChart dailyEntry={dailyEntry} user={user} />
      <Grid
        container
        justifyContent="space-evenly"
        sx={{ marginBottom: '1rem' }}
      >
        <DailyEntryMetricView
          fieldType="weight"
          fieldLabel="Weight"
          fieldValue={`${weight} lbs`}
          canEdit={isFirstDay ? false : true}
          openDialog={() => {
            setOpenUpdateWeightDialog(true)
          }}
        />
        <DailyEntryMetricView
          fieldType="activity"
          fieldLabel="Activity Level"
          fieldValue={activityLevel}
          openDialog={() => {
            setOpenUpdateActivityLevelDialog(true)
          }}
        />
      </Grid>
      <DailyEntryMealsTable
        rows={dailyEntry?.dailyEntryMeals}
        useApi={useApi}
        handleOpenAddMealDialog={() => {
          setOpenMealDialog(true)
        }}
      />{' '}
    </>
  ) : (
    <>
      <DailyEntryCreateNew
        date={currentlySelectedDate!}
        cycle={cycle}
        useApi={useApi}
        sub={user?.sub!}
        setLoading={setLoading}
        setDailyEntry={setDailyEntry}
      />
    </>
  )

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
      <AddMealToDailyEntryDialog
        entry={dailyEntry!}
        open={openMealDialog}
        useApi={useApi}
        setDialogOpenState={setOpenMealDialog}
      />
      {!matchesMD && mobileDateView}
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
              setPickerDate(newValue)
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
          {loading ? <LinearProgress /> : mainContent}
        </Grid>
      </Grid>
    </>
  )
}
