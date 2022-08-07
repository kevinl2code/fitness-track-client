import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ROUTES } from '.'
import { PublicLayout, AuthLayout } from '../layouts'
import { Cycle, UserCredentials } from '../model/Model'

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
import { useStore } from '../store/useStore'

interface Props {
  // setAppUser: (user: UserCredentials | null) => Promise<void>
  // setSelectedCycleContext: React.Dispatch<React.SetStateAction<Cycle | null>>
  handleLogout: () => void
}

export const NavigationContainer: React.FC<Props> = ({
  // setAppUser,
  // setSelectedCycleContext,
  handleLogout,
}) => {
  const { credentials } = useStore((state) => state.credentialsSlice)
  const navigate = useNavigate()
  const routeParams = useLocation()
  const isAuthRoute = routeParams.pathname.split('/').includes('app')
  useEffect(() => {
    if (!credentials && isAuthRoute) {
      navigate('/')
    }
  }, [isAuthRoute, navigate, credentials])

  return (
    <Routes>
      <Route path={ROUTES.root} element={<PublicLayout />}>
        <Route index element={<InitialPage />} />
        <Route path={ROUTES.initial} element={<InitialPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />

        <Route path={ROUTES.register} element={<RegistrationPage />} />
        <Route path={ROUTES.forgot} element={<ForgotPasswordPage />} />
      </Route>
      <Route path={ROUTES.appRoot} element={<AuthLayout />}>
        <Route index element={<DailyEntriesPage />} />
        <Route path={ROUTES.dailyEntries} element={<DailyEntriesPage />} />
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.foods} element={<FoodsPage />} />
        <Route path={ROUTES.admin} element={<AdminPage />} />
        <Route
          path={ROUTES.more}
          element={<MorePage handleLogout={handleLogout} />}
        />
        <Route path={ROUTES.plan} element={<PlanPage />} />
        <Route path={ROUTES.profile} element={<ProfilePage />} />
        <Route
          path={ROUTES.appSettings}
          element={
            <AppSettingsPage
            // setSelectedCycleContext={setSelectedCycleContext}
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
