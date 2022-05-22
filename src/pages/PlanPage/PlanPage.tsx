import DatePicker from '@mui/lab/DatePicker'
import { Box, Button, Container, Grid } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext, useState } from 'react'
import { CycleContext, EntriesContext, UserContext } from '../../app/App'
import { UpdateGoalWeightDialog } from '../../components/dialogs/UpdateGoalWeightDialog'
import { PlanPageMainView } from '../../components/PlanPageMainView'
import { Cycle, DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { Calculate } from '../../utilities/Calculate'
import { useMutation, useQueryClient } from 'react-query'

import { Convert } from '../../utilities/Convert'
import { Sort } from '../../utilities/Sort'

interface Props {}

export const PlanPage: React.FC<Props> = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const entries = useContext(EntriesContext)
  const cycleEndDate = DateTime.fromISO(cycle?.endingDate!)

  const [openUpdateGoalWeightDialog, setOpenUpdateGoalWeightDialog] =
    React.useState(false)
  const [editEnabled, setEditEnabled] = useState(false)
  const [mutableCycleParams, setMutableCycleParams] = useState<{
    endingDate: string
    goalWeight: number
  }>({
    endingDate: cycle?.endingDate!,
    goalWeight: cycle?.goalWeight!,
  })
  const [pickerDate, setPickerDate] = useState<DateTime>(
    DateTime.fromISO(mutableCycleParams.endingDate)
  )
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const dataService = new DataService()
  dataService.setUser(user?.user!)
  const queryClient = useQueryClient()

  const sort = new Sort()

  const calculate = new Calculate()
  const planDuration = calculate.planDuration(
    cycle?.startDate!,
    mutableCycleParams.endingDate!
  )
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries)

  const cycleStartDate = DateTime.fromISO(cycle?.startDate!)
  const calendarMaxDate = cycleStartDate.plus({ days: 90 })

  const today = DateTime.now().startOf('day')
  const todayEntry =
    sortedEntries[sortedEntries.length - 1].entryDate ===
    today.toISODate()?.split('-')?.join('')
      ? sortedEntries[0]
      : null

  const { mutate: updateDailyEntry, isLoading: updateDailyEntryIsLoading } =
    useMutation(
      (dailyEntry: DailyEntry) => dataService.updateDailyEntry(dailyEntry),
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries('dailyEntries')
        },
      }
    )

  if (!user || !cycle) {
    return null
  }

  const cycleStateChangeBegan =
    mutableCycleParams.endingDate !== cycle.endingDate ||
    mutableCycleParams.goalWeight !== cycle.goalWeight

  const submitCycleUpdates = () => {
    if (todayEntry) {
      const cycleStart = DateTime.fromISO(cycle?.startDate!)
      const entryDate = DateTime.fromISO(todayEntry.entryDate)
      const daysSinceStart = Math.floor(entryDate.diff(cycleStart, 'days').days)
      const daysRemaining = planDuration - daysSinceStart
      const poundsToGo =
        todayEntry.dailyEntryWeight - mutableCycleParams.goalWeight
      const caloriesToGo = poundsToGo * 3500
      const deficitPerDay = caloriesToGo / daysRemaining
      const { birthday, sex, height } = user
      const age = calculate.age(birthday)
      const bmr = calculate.BMR(height, todayEntry.dailyEntryWeight, age, sex)
      const tdee = calculate.TDEE(bmr, todayEntry.dailyEntryActivityLevel)
      const targetCalories = Math.round(tdee - deficitPerDay)
      const updatedDailyEntry = {
        ...todayEntry,
        targetCalories: targetCalories,
      }
      updateDailyEntry(updatedDailyEntry)
    }
    const updatedCycle: Cycle = {
      ...cycle,
      goalWeight: mutableCycleParams.goalWeight,
      endingDate: mutableCycleParams.endingDate,
    }

    // updateCycle(updatedCycle)
  }

  const handleCancel = () => {
    setMutableCycleParams({
      endingDate: cycle?.endingDate!,
      goalWeight: cycle?.goalWeight!,
    })
    setPickerDate(cycleEndDate)
    setEditEnabled(false)
  }

  return (
    <>
      <UpdateGoalWeightDialog
        entry={todayEntry}
        cycle={cycle}
        user={user}
        open={openUpdateGoalWeightDialog}
        mutableCycleParams={mutableCycleParams}
        setMutableCycleParams={setMutableCycleParams}
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
          onChange={() => null}
          onAccept={(newValue) => {
            if (newValue) {
              console.log(newValue)
              setPickerDate(newValue)
              setMutableCycleParams({
                ...mutableCycleParams,
                endingDate: newValue.toISODate()?.split('-')?.join(''),
              })
            }
          }}
          // onChange={(newValue) => {
          //   if (newValue) {
          //     setPickerDate(newValue)
          //   }
          // }}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box ref={inputRef}></Box>
          )}
        />
      </Grid>
      <Container>
        {cycle !== null && (
          <Grid container direction="column">
            <PlanPageMainView
              cycle={cycle}
              editEnabled={editEnabled}
              pickerDate={pickerDate}
              mutableGoalWeight={mutableCycleParams.goalWeight}
              sortedEntries={sortedEntries}
              setDatePickerOpen={setDatePickerOpen}
              setOpenUpdateGoalWeightDialog={setOpenUpdateGoalWeightDialog}
            />
            <Grid item container>
              {editEnabled ? (
                <Grid item xs={12}>
                  {cycleStateChangeBegan && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setEditEnabled(true)}
                    >
                      Submit Changes
                    </Button>
                  )}
                  <Button fullWidth variant="contained" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setEditEnabled(true)}
                  >
                    Edit
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
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
