import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { UserState } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'

let COLORS = ['#00C49F', '#C8C8C8']

interface Props {
  tdee: number
  caloriesConsumed: number
  targetCalories: number
  user: UserState | null
}

export const DailyEntryGaugeChart: React.FC<Props> = ({
  tdee,
  caloriesConsumed,
  targetCalories,
  user,
}) => {
  const [graphData, setGraphData] = useState<
    { name: string; value: number }[] | []
  >([])
  const { matchesMD, matchesSM } = useMediaQueries()
  const parentDivWidth = document.getElementById(
    'dailyEntryMainContentContainer'
  )?.offsetWidth

  const remainingCals = tdee - caloriesConsumed
  const targetCaloriesRemaining = targetCalories - caloriesConsumed

  const overTargetUnderLimit =
    caloriesConsumed > targetCalories && caloriesConsumed < tdee

  const overTargetAndLimit = caloriesConsumed > tdee

  const superLimit = caloriesConsumed < 5000 ? 5000 : 10000

  useEffect(() => {
    if (caloriesConsumed === 0) {
      COLORS = ['#00C49F', '#C8C8C8']
      setGraphData([
        {
          name: 'Calories Consumed',
          value: caloriesConsumed,
        },
        {
          name: 'Target',
          value: targetCaloriesRemaining > 0 ? targetCaloriesRemaining : 1,
        },
      ])
    } else if (overTargetUnderLimit) {
      COLORS = ['#ff9800', '#C8C8C8']
      setGraphData([
        {
          name: 'Calories over Target',
          value: caloriesConsumed,
        },
        {
          name: 'Cals under TDEE remaining',
          value: remainingCals,
        },
      ])
    } else if (!overTargetAndLimit) {
      COLORS = ['#00C49F', '#C8C8C8']
      setGraphData([
        {
          name: 'Calories Consumed',
          value: caloriesConsumed,
        },
        { name: 'Target', value: targetCaloriesRemaining },
      ])
    } else {
      COLORS = ['#ef5350', '#C8C8C8']
      setGraphData([
        {
          name: 'Calories Consumed',
          value: caloriesConsumed,
        },
        { name: 'Target', value: superLimit - caloriesConsumed },
      ])
    }
    return () => {
      setGraphData([])
    }
  }, [
    caloriesConsumed,
    overTargetAndLimit,
    overTargetUnderLimit,
    remainingCals,
    superLimit,
    targetCaloriesRemaining,
  ])

  if (!parentDivWidth || !user) {
    return null
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
              ? '#ef5350'
              : overTargetUnderLimit
              ? '#ff9800'
              : '#00C49F'
          }
        >
          {caloriesConsumed.toFixed(0)}
          {' / '}
          {overTargetAndLimit
            ? superLimit
            : overTargetUnderLimit
            ? tdee
            : targetCalories}
        </text>
        <text
          fontWeight="700"
          x={cx}
          y={cy}
          dy={20}
          textAnchor="middle"
          fill={
            overTargetAndLimit
              ? '#ef5350'
              : overTargetUnderLimit
              ? '#ff9800'
              : '#00C49F'
          }
        >
          {overTargetAndLimit
            ? 'DAILY LIMIT EXCEEDED'
            : overTargetUnderLimit
            ? 'CALORIES UNDER TDEE'
            : 'CALORIES UNDER TARGET'}
        </text>
      </g>
    )
  }

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
        data={graphData}
        isAnimationActive={false}
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
        {graphData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  )
}
