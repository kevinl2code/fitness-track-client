import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '.'
import { RootLayout } from '../layouts/RootLayout'
import { DailyEntriesPage } from '../pages/DailyEntriesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { RegistrationPage } from '../pages/RegistrationPage'

export const NavigationContainer: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<RootLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.dailyEntries} element={<DailyEntriesPage />} />
        <Route path={ROUTES.register} element={<RegistrationPage />} />
      </Route>
    </Routes>
  )
}
