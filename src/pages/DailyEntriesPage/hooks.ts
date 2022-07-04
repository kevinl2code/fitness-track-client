import { DateTime } from 'luxon'
import { Cycle, DailyEntry, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { Sort } from '../../utilities/Sort'
import { formattedActivityLevel } from '../../utilities/Convert'

interface Props {
  pickerDate: DateTime
  cycle: Cycle | null
  entries: DailyEntry[] | []
  dailyEntry: DailyEntry | null
  user: UserState | null
}

export const dailyEntryPageHooks = ({
  pickerDate,
  cycle,
  entries,
  dailyEntry,
  user,
}: Props) => {
  const today = DateTime.now().startOf('day')
  const cycleStartDate = DateTime.fromISO(cycle?.startDate!)
  const cycleEndDate = cycle?.endingDate
    ? DateTime.fromISO(cycle?.endingDate)
    : null

  const calendarMaxDate =
    cycleEndDate && today.startOf('day') > cycleEndDate?.startOf('day')
      ? cycleEndDate
      : today
  const currentlySelectedDate = pickerDate?.toISODate()?.split('-')?.join('')
  const sort = new Sort()
  const calculate = new Calculate()
  const sortedEntries: DailyEntry[] = sort.dailyEntriesByDate(entries).reverse()
  const lastEntryDate = DateTime.fromISO(sortedEntries[0]?.entryDate).startOf(
    'day'
  )
  const cycleHasEntries = entries.length > 0

  //TODO ADD PAGESTATE FOR THIS
  const userNeverWeighedIn =
    !cycleHasEntries && Math.floor(today.diff(cycleStartDate, 'days').days) > 2
  const daysSinceLastActive = Math.floor(today.diff(lastEntryDate, 'days').days)

  const userAwayOneDay = daysSinceLastActive === 1
  const userAwaySeveralDays = daysSinceLastActive > 2
  const isFirstDay = cycle?.startDate === currentlySelectedDate
  const todaySelected =
    pickerDate.startOf('day').valueOf() === today.startOf('day').valueOf()
  const isLastEntryDay =
    cycle?.endingDate === currentlySelectedDate ||
    today > cycleEndDate?.startOf('day')!

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
  const { birthday, sex, height } = user!
  const age = calculate.age(birthday)
  const bmr = calculate.BMR(height, dailyEntry?.dailyEntryWeight!, age, sex)

  const displayWeight: number | '-' = dailyEntry?.dailyEntryWeight || '-'
  const activityLevel = dailyEntry?.dailyEntryActivityLevel
    ? formattedActivityLevel[dailyEntry?.dailyEntryActivityLevel]
    : '-'

  const isEditable =
    pickerDate.minus({ days: 1 }).startOf('day').valueOf() ===
      today.minus({ days: 1 }).startOf('day').valueOf() ||
    pickerDate.startOf('day').valueOf() ===
      today.minus({ days: 1 }).startOf('day').valueOf()

  const hasReachedCycleEndDate =
    today.startOf('day').valueOf() >= cycleEndDate?.startOf('day').valueOf()!

  const pageStates = {
    loading: entries === null,
    todayHasEntry: cycle !== null && entries !== null && dailyEntry,
    firstDayNoEntry: cycle?.isActive && isEditable && isFirstDay && !dailyEntry,
    todayNoEntry:
      cycle?.isActive &&
      isEditable &&
      !isFirstDay &&
      todaySelected &&
      !dailyEntry &&
      !userAwaySeveralDays &&
      !userAwayOneDay,
    todayNoEntryMissedYesterday:
      cycle?.isActive &&
      isEditable &&
      !isFirstDay &&
      todaySelected &&
      !dailyEntry &&
      !userAwaySeveralDays &&
      userAwayOneDay,
    todayNoEntryReturningFromAWOL:
      cycle?.isActive &&
      isEditable &&
      !isFirstDay &&
      todaySelected &&
      !dailyEntry &&
      userAwaySeveralDays,
    previousDayNoEntry:
      cycle?.isActive &&
      isEditable &&
      !isFirstDay &&
      !todaySelected &&
      !dailyEntry,
    awolDayNoEntry:
      cycle?.isActive &&
      !isEditable &&
      !isFirstDay &&
      !todaySelected &&
      !lastEntryDate &&
      !dailyEntry,
    lastDayNotFinalized:
      cycle?.isActive! && !isFirstDay && hasReachedCycleEndDate,
    lastDayNotFinalizedMissedYesterday:
      cycle?.isActive &&
      !isFirstDay &&
      isLastEntryDay &&
      userAwayOneDay &&
      hasReachedCycleEndDate,
    lastDayNotFinalizedReturningFromAWOL:
      cycle?.isActive &&
      !isFirstDay &&
      isLastEntryDay &&
      userAwaySeveralDays &&
      hasReachedCycleEndDate,
  }

  return {
    currentlySelectedDate,
    isEditable,
    isFirstDay,
    isLastEntryDay,
    todaySelected,
    userAwayOneDay,
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
  }
}
