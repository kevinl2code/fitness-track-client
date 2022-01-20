import { Card, CardContent } from '@mui/material'
import React from 'react'
import { DailyEntry, Sex } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'

interface Props {
  dailyEntry: DailyEntry | null
}

export const DailyEntryDetails: React.FC<Props> = ({ dailyEntry }) => {
  if (!dailyEntry) {
    return null
  }

  const calculate = new Calculate()
  const { dailyEntryWeight, dailyEntryActivityLevel, dailyEntryMeals } =
    dailyEntry
  const fakeUser = {
    height: 74,
    sex: 'MALE' as Sex,
    age: 30,
  }

  const bmr = calculate.BMR(
    fakeUser.height,
    dailyEntryWeight,
    fakeUser.age,
    fakeUser.sex
  )
  const tdee = calculate.TDEE(bmr!, dailyEntryActivityLevel)

  const confirmedMeals = dailyEntryMeals?.length > 0 ? dailyEntryMeals : null

  const caloriesConsumed =
    confirmedMeals?.reduce((acc, meal) => acc + meal.calories, 0) || 0

  const proteinConsumed =
    confirmedMeals?.reduce((acc, meal) => acc + meal.protein, 0) || 0

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
