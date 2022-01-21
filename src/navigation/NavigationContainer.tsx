import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '.'
import { PublicLayout, AuthLayout } from '../layouts'
import { Cycle, User } from '../model/Model'

import { useNavigate, useLocation } from 'react-router-dom'
import { DailyEntriesPage } from '../pages/DailyEntriesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import { LoginPage } from '../pages/LoginPage'
import { RegistrationPage } from '../pages/RegistrationPage'
import { FoodsPage } from '../pages/FoodsPage'

interface Props {
  setAppUser: (user: User | null) => Promise<void>
  setCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
  user: User | null
}

export const NavigationContainer: React.FC<Props> = ({
  setAppUser,
  setCycleContext,
  user,
}) => {
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
        <Route index element={<LoginPage setUser={setAppUser} />} />
        <Route
          path={ROUTES.login}
          element={<LoginPage setUser={setAppUser} />}
        />

        <Route path={ROUTES.register} element={<RegistrationPage />} />
        <Route path={ROUTES.forgot} element={<ForgotPasswordPage />} />
        <Route
          path={ROUTES.appRoot}
          element={<AuthLayout setAppUser={setAppUser} />}
        >
          <Route
            index
            element={<DashboardPage setCycleContext={setCycleContext} />}
          />
          <Route
            path={ROUTES.dashboard}
            element={<DashboardPage setCycleContext={setCycleContext} />}
          />
          <Route path={ROUTES.dailyEntries} element={<DailyEntriesPage />} />
          <Route path={ROUTES.foods} element={<FoodsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
