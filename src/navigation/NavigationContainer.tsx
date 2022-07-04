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
import { AdminPage } from '../pages/AdminPage'
import { MorePage } from '../pages/MorePage'
import { PlanPage } from '../pages/PlanPage'
import { ProfilePage } from '../pages/ProfilePage/ProfilePage'
import { AppSettingsPage } from '../pages/AppSettingsPage'
import { FrequentlyAskedQuestionsPage } from '../pages/FrequentlyAskedQuestionsPage'
import { TermsAndConditionsPage } from '../pages/AppTermsAndConditionsPage'
import { InitialPage } from '../pages/InitialPage'

interface Props {
  setAppUser: (user: User | null) => Promise<void>
  setSelectedCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
  handleLogout: () => void
  user: User | null
}

export const NavigationContainer: React.FC<Props> = ({
  setAppUser,
  setSelectedCycleContext,
  handleLogout,
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
        <Route index element={<InitialPage />} />
        <Route path={ROUTES.initial} element={<InitialPage />} />
        <Route
          path={ROUTES.login}
          element={<LoginPage setUser={setAppUser} />}
        />

        <Route path={ROUTES.register} element={<RegistrationPage />} />
        <Route path={ROUTES.forgot} element={<ForgotPasswordPage />} />
      </Route>
      <Route
        path={ROUTES.appRoot}
        element={<AuthLayout setAppUser={setAppUser} />}
      >
        <Route index element={<DashboardPage />} />
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.dailyEntries} element={<DailyEntriesPage />} />
        <Route path={ROUTES.foods} element={<FoodsPage />} />
        <Route path={ROUTES.admin} element={<AdminPage />} />
        <Route
          path={ROUTES.more}
          element={
            <MorePage setUser={setAppUser} handleLogout={handleLogout} />
          }
        />
        <Route path={ROUTES.plan} element={<PlanPage />} />
        <Route path={ROUTES.profile} element={<ProfilePage />} />
        <Route
          path={ROUTES.appSettings}
          element={
            <AppSettingsPage
              setSelectedCycleContext={setSelectedCycleContext}
            />
          }
        />
        <Route path={ROUTES.faq} element={<FrequentlyAskedQuestionsPage />} />
        <Route
          path={ROUTES.termsAndConditions}
          element={<TermsAndConditionsPage />}
        />
      </Route>
    </Routes>
  )
}
