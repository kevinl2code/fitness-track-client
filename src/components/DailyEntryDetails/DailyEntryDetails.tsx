import { Card, CardContent } from '@mui/material'
import React from 'react'
import { DailyEntry, Sex, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'

interface Props {
  dailyEntry: DailyEntry | null
  user: UserState | null
}

export const DailyEntryDetails: React.FC<Props> = ({ dailyEntry, user }) => {
  if (!dailyEntry || !user) {
    return null
  }

  const calculate = new Calculate()
  const { dailyEntryWeight, dailyEntryActivityLevel, dailyEntryConsumables } =
    dailyEntry
  const fakeUser = {
    height: 74,
    sex: 'male' as Sex,
    age: 30,
  }

  const bmr = calculate.BMR(
    fakeUser.height,
    dailyEntryWeight,
    fakeUser.age,
    fakeUser.sex
  )
  const tdee = calculate.TDEE(bmr!, dailyEntryActivityLevel)

  const confirmedConsumables =
    dailyEntryConsumables?.length > 0 ? dailyEntryConsumables : null

  const caloriesConsumed =
    confirmedConsumables?.reduce(
      (acc, consumable) => acc + consumable.calories,
      0
    ) || 0

  const proteinConsumed =
    confirmedConsumables?.reduce(
      (acc, consumable) => acc + consumable.protein,
      0
    ) || 0

  const proteinRequired = calculate.proteinRequiredForWeightLoss(
    dailyEntryWeight,
    dailyEntryActivityLevel
  )

  const bmi = calculate.BMI(fakeUser.height, dailyEntryWeight)

  return (
    <Card variant="outlined">
      <CardContent>{`BMI: ${bmi}`}</CardContent>
      <CardContent>{`TDEE: ${tdee}`}</CardContent>
      <CardContent>{`Calories: ${caloriesConsumed}`}</CardContent>
      <CardContent>{`Protein: ${proteinConsumed}`}</CardContent>
      <CardContent>{`MinProtein: ${proteinRequired.minimum}`}</CardContent>
      <CardContent>{`MaxProtein: ${proteinRequired.maximum}`}</CardContent>
    </Card>
  )
}
