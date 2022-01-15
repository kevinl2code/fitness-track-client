import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '.'
import { PublicLayout } from '../layouts/PublicLayout'
import { RootLayout } from '../layouts/RootLayout'
import { DailyEntriesPage } from '../pages/DailyEntriesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'

interface Props {
  user: string | null
  setUser: React.Dispatch<React.SetStateAction<string | null>>
}

export const NavigationContainer: React.FC<Props> = ({ user, setUser }) => {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<PublicLayout />}>
        <Route index element={<LoginPage setUser={setUser} />} />
        <Route path={ROUTES.login} element={<LoginPage setUser={setUser} />} />

        <Route path={ROUTES.register} element={<RegistrationPage />} />
        <Route path={ROUTES.forgot} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.appRoot} element={<RootLayout setUser={setUser} />}>
          <Route index element={<DashboardPage user={user} />} />
          <Route
            path={ROUTES.dashboard}
            element={<DashboardPage user={user} />}
          />
          <Route path={ROUTES.dailyEntries} element={<DailyEntriesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
