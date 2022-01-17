import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '.'
import { PublicLayout, AuthLayout } from '../layouts'
import { User } from '../model/Model'

import { useNavigate, useLocation } from 'react-router-dom'
import { DailyEntriesPage } from '../pages/DailyEntriesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'

interface Props {
  setUser: (user: User | null) => Promise<void>
  user: User | null
}

export const NavigationContainer: React.FC<Props> = ({ setUser, user }) => {
  const navigate = useNavigate()
  const routeParams = useLocation()
  const isAuthRoute = routeParams.pathname.split('/').includes('app')
  useEffect(() => {
    if (!user && isAuthRoute) {
      navigate('/')
    }
  }, [isAuthRoute, navigate, user])

  return (
    <Routes>
      <Route path={ROUTES.root} element={<PublicLayout />}>
        <Route index element={<LoginPage setUser={setUser} />} />
        <Route path={ROUTES.login} element={<LoginPage setUser={setUser} />} />

        <Route path={ROUTES.register} element={<RegistrationPage />} />
        <Route path={ROUTES.forgot} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.appRoot} element={<AuthLayout setUser={setUser} />}>
          <Route index element={<DashboardPage />} />
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.dailyEntries} element={<DailyEntriesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
