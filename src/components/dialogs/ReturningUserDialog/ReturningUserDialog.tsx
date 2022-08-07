import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material'
import { DateTime } from 'luxon'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ActivityLevel, Cycle, DailyEntry } from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { ReturningUserDialogLongHiatusView } from './ReturningUserDialogLongHiatusView'
import { ReturningUserDialogShortHiatusForm } from './ReturningUserDialogShortHiatusForm'
import { useStore } from '../../../store/useStore'
interface IFormInput {
  weight: number
  activityLevel: ActivityLevel
}

interface Props {
  open: boolean
  dataService: DataService
  cycle: Cycle | null
  entries: DailyEntry[]
  daysSinceLastActive: number
  setDialogOpenState: React.Dispatch<React.SetStateAction<boolean>>
}
const today = DateTime.now().startOf('day')
const yesterday = today.minus({ days: 1 })
export const ReturningUserDialog: React.FC<Props> = ({
  open,
  dataService,
  cycle,
  entries,
  daysSinceLastActive,
  setDialogOpenState,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm()
  const { userData } = useStore((state) => state.userSlice)
  if (!userData || !cycle) {
    return null
  }

  const longHiatus = daysSinceLastActive > 6
  const longHiatusText = `Looks like you've been away for quite some time so we've closed out the plan you had been on.  Once you're ready, pick up where you left off by starting a new plan.`
  const shortHiatusText = `Looks like you've been away for a few days. Go ahead and weigh in for today and we'll auto generate entries for the days you were gone based on where you currently stand.`

  const dialogText = longHiatus ? longHiatusText : shortHiatusText

  return (
    <Dialog open={open} fullScreen={true}>
      <DialogTitle>Welcome Back!</DialogTitle>
      <DialogContentText>{dialogText}</DialogContentText>
      <DialogContent>
        {!longHiatus && (
          <ReturningUserDialogShortHiatusForm
            entries={entries}
            cycle={cycle}
            user={userData}
            dataService={dataService}
            control={control}
            register={register}
            handleSubmit={handleSubmit}
            setDialogOpenState={setDialogOpenState}
          />
        )}
        {longHiatus && (
          <ReturningUserDialogLongHiatusView
            cycle={cycle}
            finalEntry={entries[0]}
            dataService={dataService}
            setDialogOpenState={setDialogOpenState}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
