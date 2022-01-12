import React, { useCallback, useEffect } from 'react'
import { DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { Calculate } from '../../utilities/Calculate'

interface Props {}

export const DashboardPage: React.FC<Props> = (props: Props) => {
  const [entries, setEntries] = React.useState<DailyEntry[] | null>(null)
  const calculate = new Calculate()
  const getData = useCallback(async () => {
    const dataservice = new DataService()
    const data = await dataservice.getDailyEntries()
    setEntries(data)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  console.log(entries)
  console.log(calculate.TDEE(1000, 'SEDENTARY'))
  return (
    <>
      <h1>LANDING PAGE</h1>
    </>
  )
}
