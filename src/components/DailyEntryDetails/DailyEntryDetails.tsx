import { Card, CardContent } from '@mui/material'
import React from 'react'
import { DailyEntry, Meal, Sex } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'

interface Props {
  dailyEntry: DailyEntry | null
}

export const DailyEntryDetails: React.FC<Props> = ({ dailyEntry }) => {
  if (!dailyEntry) {
    return null
  }

  const calculate = new Calculate()
  const { weight, activityLevel, meals } = dailyEntry
  const fakeUser = {
    height: 74,
    sex: 'MALE' as Sex,
    age: 30,
  }

  const bmr = calculate.BMR(fakeUser.height, weight, fakeUser.age, fakeUser.sex)
  const tdee = calculate.TDEE(bmr!, activityLevel)

  const confirmedMeals = meals.length > 0 ? meals : null

  const caloriesConsumed =
    confirmedMeals?.reduce((acc, meal) => acc + meal.calories, 0) || 0

  const proteinConsumed =
    confirmedMeals?.reduce((acc, meal) => acc + meal.protein, 0) || 0

  const proteinRequired = calculate.proteinRequiredForWeightLoss(
    weight,
    activityLevel
  )

  const bmi = calculate.BMI(fakeUser.height, weight)

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
