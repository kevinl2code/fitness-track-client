import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider, CssBaseline } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import React, { useEffect } from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'
import { Cycle, DailyEntry, User, UserState } from '../model/Model'
import { AuthService } from '../services/AuthService'
import { DataService } from '../services/DataService'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../navigation'
import { useQuery } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorPage } from '../pages/ErrorPage'
import { Sort } from '../utilities/Sort'
export const UserContext = React.createContext<UserState | null>(null)
export const CycleContext = React.createContext<Cycle | null>(null)
export const EntriesContext = React.createContext<DailyEntry[] | []>([])

const authService = new AuthService()
const dataService = new DataService()

function App() {
  const [user, setUser] = React.useState<User | null>(null)
  const [userContext, setUserContext] = React.useState<UserState | null>(null)
  const [cycleContext, setCycleContext] = React.useState<Cycle | null>(null)
  const [entriesContext, setEntriesContext] = React.useState<DailyEntry[] | []>(
    []
  )
  const sort = new Sort()
  const navigate = useNavigate()

  const { isLoading: cyclesLoading, data: fetchedCycles } = useQuery(
    'cycles',
    () => dataService.getUserCycles(userContext?.sub!),
    {
      enabled: !!userContext,
      onSuccess: (data) => {
        const currentlyActiveCycle = data?.find((cycle) => {
          return cycle.isActive === true
        })
        if (currentlyActiveCycle) {
          setCycleContext(currentlyActiveCycle)
        } else if (data && !currentlyActiveCycle) {
          const sortedCycles: Cycle[] = sort.cyclesByDate(data).reverse()
          console.log(data)
          setCycleContext(sortedCycles[0])
        }
      },
    }
  )

  const { isLoading: dailyEntriesLoading, data: fetchedDailyEntries } =
    useQuery(
      ['dailyEntries'],
      () => dataService.getDailyEntriesForCycle(cycleContext?.cycleId!),
      {
        enabled: !!cycleContext,
        onSuccess: (data) => {
          if (data && data.length > 0) {
            setEntriesContext(data)
          }
        },
      }
    )

  // console.log({ appEntriesContext: entriesContext })

  const setAppUser = async (user: User | null) => {
    setUser(user)
    if (user) {
      const isAdmin = authService.isUserAdmin(user)
      if (isAdmin) {
        user.isAdmin = true
      }
      dataService.setUser(user)
      await authService.getAWSTemporaryCreds(user.cognitoUser)
      const userInfo = await authService.currentUserInfo()

      setUserContext({
        user: {
          userName: userInfo.username,
          cognitoUser: user.cognitoUser,
          isAdmin: user.isAdmin,
        },
        firstName: userInfo.attributes.given_name,
        lastName: userInfo.attributes.family_name,
        sex: userInfo.attributes.gender,
        height: parseInt(userInfo.attributes['custom:height']),
        birthday: userInfo.attributes.birthdate,
        email: userInfo.attributes.email,
        sub: userInfo.attributes.sub,
      })
      navigate(`app/${ROUTES.dailyEntries}`)
    }
    if (!user) {
      setUserContext(null)
      setCycleContext(null)
    }
  }

  return cyclesLoading || dailyEntriesLoading ? (
    <div>LOADING</div>
  ) : (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={DateAdapter} locale={'enLocale'}>
        <UserContext.Provider value={userContext}>
          <CycleContext.Provider value={cycleContext}>
            <EntriesContext.Provider value={entriesContext}>
              <ErrorBoundary FallbackComponent={ErrorPage}>
                <NavigationContainer
                  setAppUser={setAppUser}
                  setCycleContext={setCycleContext}
                  user={user}
                />
              </ErrorBoundary>
            </EntriesContext.Provider>
          </CycleContext.Provider>
        </UserContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App

//TODO - Need to remove authenticated state when token expires.
//TODO - Context is lost on refresh due to state being reset.  Need to use local storage to get around this.
