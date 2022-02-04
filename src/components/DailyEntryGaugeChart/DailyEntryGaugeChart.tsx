import React, { useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import { DailyEntry, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { useMediaQueries } from '../../utilities/useMediaQueries'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface Props {
  dailyEntry: DailyEntry
  user: UserState | null
}
const data = [
  { name: 'Calories Consumed', value: 300 },
  { name: 'Calories Expended', value: 3000 },
]

export const DailyEntryGaugeChart: React.FC<Props> = ({ dailyEntry, user }) => {
  const { matchesMD, matchesSM } = useMediaQueries()
  const parentDivWidth = document.getElementById(
    'dailyEntryMainContentContainer'
  )?.offsetWidth
  if (!parentDivWidth || !user) {
    return null
  }
  const calculate = new Calculate()
  const { dailyEntryWeight, dailyEntryActivityLevel, dailyEntryConsumables } =
    dailyEntry
  const { birthday, sex, height } = user
  const age = calculate.age(birthday)

  const bmr = calculate.BMR(height, dailyEntryWeight, age, sex)
  const tdee = calculate.TDEE(bmr!, dailyEntryActivityLevel)
  const confirmedConsumables =
    dailyEntryConsumables?.length > 0 ? dailyEntryConsumables : null
  const caloriesConsumed =
    confirmedConsumables?.reduce(
      (acc, consumable) => acc + consumable.calories,
      0
    ) || 0
  const remainingCals = parseInt(tdee) - caloriesConsumed

  const data = [
    { name: 'Calories Consumed', value: caloriesConsumed },
    { name: 'Calories Expended', value: remainingCals },
  ]
  const innerRadius = matchesMD
    ? parentDivWidth * 0.2
    : matchesSM
    ? parentDivWidth * 0.2
    : parentDivWidth * 0.35
  const outerRadius = matchesMD
    ? parentDivWidth * 0.25
    : matchesSM
    ? parentDivWidth * 0.25
    : parentDivWidth * 0.4

  const renderCustomLabel = ({ cx, cy, fill }: any) => {
    return (
      <g>
        <text x={cx} y={cy} textAnchor="middle" fill={fill}>
          {caloriesConsumed}
          {' / '}
          {tdee}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill={fill}>
          Consumed / Expended
        </text>
      </g>
    )
  }

  return (
    <PieChart
      width={parentDivWidth}
      height={400}
      //Key is only being set to fix issue of animation not firing on first render.
      //Active github issue https://github.com/recharts/recharts/issues/829
      // key={Math.random() * 100}
    >
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        startAngle={220}
        endAngle={-40}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        onAnimationEnd={() => console.log('ran')}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        labelLine={false}
        label={(props) => renderCustomLabel(props)}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  )
}
