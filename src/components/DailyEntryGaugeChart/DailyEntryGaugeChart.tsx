import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { DailyEntry, UserState } from '../../model/Model'
import { Calculate } from '../../utilities/Calculate'
import { useMediaQueries } from '../../utilities/useMediaQueries'

let COLORS = ['#00C49F', '#C8C8C8']

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
  const targetCals = 1000
  const targetCalsRemaining = targetCals - caloriesConsumed

  let data = [
    {
      name: 'Calories Consumed',
      value: caloriesConsumed,
    },
    { name: 'Target', value: targetCalsRemaining },
  ]

  const overTargetUnderLimit =
    caloriesConsumed > targetCals && caloriesConsumed < parseInt(tdee)

  const overTargetAndLimit = caloriesConsumed > parseInt(tdee)

  const superLimit = caloriesConsumed < 5000 ? 5000 : 10000

  if (overTargetUnderLimit) {
    COLORS = ['#FFBB28', '#C8C8C8']
    data = [
      {
        name: 'Calories over Target',
        value: caloriesConsumed,
      },
      {
        name: 'Cals under TDEE remaining',
        value: remainingCals,
      },
    ]
  } else if (!overTargetAndLimit) {
    COLORS = ['#00C49F', '#C8C8C8']
    data = [
      {
        name: 'Calories Consumed',
        value: caloriesConsumed,
      },
      { name: 'Target', value: targetCalsRemaining },
    ]
  } else {
    COLORS = ['#d32f2f', '#C8C8C8']
    data = [
      {
        name: 'Calories Consumed',
        value: caloriesConsumed,
      },
      { name: 'Target', value: superLimit - caloriesConsumed },
    ]
  }

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
        <text
          fontWeight="700"
          fontSize="1.5rem"
          x={cx}
          y={cy}
          textAnchor="middle"
          fill={
            overTargetAndLimit
              ? '#d32f2f'
              : overTargetUnderLimit
              ? '#FFBB28'
              : '#00C49F'
          }
        >
          {caloriesConsumed}
          {' / '}
          {overTargetAndLimit
            ? superLimit
            : overTargetUnderLimit
            ? tdee
            : targetCals}
        </text>
        <text
          fontWeight="700"
          x={cx}
          y={cy}
          dy={20}
          textAnchor="middle"
          fill={
            overTargetAndLimit
              ? '#d32f2f'
              : overTargetUnderLimit
              ? '#FFBB28'
              : '#00C49F'
          }
        >
          {overTargetAndLimit
            ? 'DAILY LIMIT EXCEEDED'
            : overTargetUnderLimit
            ? 'OVER CALORIE TARGET'
            : 'UNDER CALORIE TARGET'}
        </text>
      </g>
    )
  }

  // console.log({
  //   consumed: caloriesConsumed,
  //   target: targetCals,
  //   calsOverTarget: calsOverTarget,
  //   tdee: tdee,
  // })

  return (
    <PieChart
      width={parentDivWidth}
      height={matchesMD ? 350 : 300}
      // style={{ top: '-100px' }}
      //Key is only being set to fix issue of animation not firing on first render.
      //Active github issue https://github.com/recharts/recharts/issues/829
      // key={Math.random() * 100}
    >
      <Pie
        data={data}
        blendStroke
        cx="50%"
        cy="60%"
        startAngle={220}
        endAngle={-40}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        onAnimationEnd={() => console.log('ran')}
        fill="#8884d8"
        paddingAngle={0}
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
