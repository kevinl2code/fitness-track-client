import React, { useCallback, useEffect } from 'react'
import { DailyEntry } from '../../model/Model'
import { DataService } from '../../services/DataService'

interface Props {}

export const DashboardPage: React.FC<Props> = (props: Props) => {
  const [entries, setEntries] = React.useState<DailyEntry[] | null>(null)

  const getData = useCallback(async () => {
    const dataservice = new DataService()
    const data = await dataservice.getDailyEntries()
    setEntries(data)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  console.log(entries)
  return (
    <>
      <h1>LANDING PAGE</h1>
    </>
  )
}
