import { Tabs, Tab } from '@mui/material'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../navigation'
interface Props {}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const MainAppBarTabs: React.FC<Props> = ({}) => {
  const [value, setValue] = React.useState(0)
  const navigate = useNavigate()
  const routeParams = useLocation()
  const currentPath = routeParams.pathname.substring(1)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="basic tabs example"
      textColor="inherit"
      sx={{
        height: '100%',
        flexGrow: 1,
        marginLeft: '2rem',
      }}
    >
      <Tab
        label="Dashboard"
        {...a11yProps(0)}
        onClick={() => navigate(ROUTES.dashboard)}
      />
      <Tab
        label="Daily Entries"
        {...a11yProps(1)}
        onClick={() => navigate(ROUTES.dailyEntries)}
      />
      <Tab
        label="My Foods"
        {...a11yProps(2)}
        onClick={() => navigate(ROUTES.foods)}
      />
    </Tabs>
  )
}
