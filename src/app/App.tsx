import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider, CssBaseline } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import React, { createContext, useEffect, useState } from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'
import {
  Cycle,
  DailyEntry,
  User,
  UserFoodItem,
  UserState,
} from '../model/Model'
import { AuthService } from '../services/AuthService'
import { DataService } from '../services/DataService'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../navigation'
import { QueryCache, useQuery, useQueryClient } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorPage } from '../pages/ErrorPage'
import { Sort } from '../utilities/Sort'
import { useStore } from '../store/useStore'
import { useUserStore } from '../store/useUserStore'
import { AppLoadingPage } from '../pages/AppLoadingPage'
// export const EntriesContext = createContext<DailyEntry[] | []>([])
export const UserFoodItemsContext = createContext<UserFoodItem[]>([])

const authService = new AuthService()
const dataService = new DataService()
const twentyFourHoursInMs = 1000 * 60 * 60 * 24

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [userFoodItemsContext, setUserFoodItemsContext] = useState<
    UserFoodItem[]
  >([])
  // const [setEntriesContext] = useState<DailyEntry[] | []>([])
  const { userData, bootstrapUser, removeUser } = useUserStore()
  const { setEntries } = useStore((state) => state.entriesSlice)
  const { setCycleList } = useStore((state) => state.cycleListSlice)
  const { selectedCycle, setSelectedCycle } = useStore(
    (state) => state.selectedCycleSlice
  )
  const sort = new Sort()
  const navigate = useNavigate()
  const queryCache = new QueryCache()
  const queryClient = useQueryClient()

  const { isLoading: cyclesLoading, data: fetchedCycles } = useQuery(
    'cycles',
    () => dataService.getUserCycles(userData?.sub!),
    {
      enabled: !!userData,
      onSuccess: (data) => {
        if (data) {
          setCycleList(data)
        }

        const currentlyActiveCycle = data?.find((cycle) => {
          return cycle.isActive === true
        })
        if (currentlyActiveCycle) {
          setSelectedCycle(currentlyActiveCycle)
        } else if (data && !currentlyActiveCycle) {
          const sortedCycles: Cycle[] = sort.cyclesByDate(data).reverse()
          sortedCycles.length > 0 && setSelectedCycle(sortedCycles[0])
        }
      },
      onError: (error) => {
        console.log(`Network Error: ${error}`)
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    }
  )

  const { isLoading: dailyEntriesLoading, data: fetchedDailyEntries } =
    useQuery(
      ['dailyEntries', selectedCycle?.cycleId],
      () => dataService.getDailyEntriesForCycle(selectedCycle?.cycleId!),
      {
        enabled: !!selectedCycle,
        onSuccess: (data) => {
          if (data && data.length > 0) {
            console.log({
              entriesOnsuccess: 'ran',
              selectedCycleContext: selectedCycle,
              susccessData: data,
            })
            setEntries(data)
          }
        },
        onError: (error) => {
          console.log(`Network Error: ${error}`)
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: twentyFourHoursInMs,
      }
    )

  const { isLoading: userFoodItemsLoading, data: fetchedUserFoodItems } =
    useQuery(
      ['userFoodItems'],
      () => dataService.getUserFoodItems(userData?.sub!),
      {
        enabled: !!userData,
        onSuccess: (data) => {
          if (data) {
            setUserFoodItemsContext(data)
          }
        },
        onError: (error) => {
          console.log(`Network Error: ${error}`)
        },
      }
    )

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
      const userState: UserState = {
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
      }
      bootstrapUser(userState)
      await queryClient.fetchQuery('cycles')
      navigate(`app/${ROUTES.dailyEntries}`)
    }
    if (!user) {
      removeUser()
      setSelectedCycle(null)
    }
  }

  window.onerror = (e) => {
    console.log(e)
  }

  const handleLogout = () => {
    queryCache.clear()
    queryClient.removeQueries('cycles')
    queryClient.removeQueries('dailyEntries')
    authService.logOut()
    setUser(null)
    removeUser()
    setSelectedCycle(null)
    setEntries([])
    setUserFoodItemsContext([])
    navigate('/')
    window.location.reload()
  }

  const isLoading = cyclesLoading || dailyEntriesLoading || userFoodItemsLoading

  return isLoading ? (
    <AppLoadingPage color={'#f0f4f7'} />
  ) : (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={DateAdapter} locale={'enLocale'}>
        <UserFoodItemsContext.Provider value={userFoodItemsContext}>
          {/* <EntriesContext.Provider value={entriesContext}> */}
          <ErrorBoundary FallbackComponent={ErrorPage}>
            <NavigationContainer
              setAppUser={setAppUser}
              handleLogout={handleLogout}
              user={user}
            />
          </ErrorBoundary>
          {/* </EntriesContext.Provider> */}
        </UserFoodItemsContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App

//TODO - Need to remove authenticated state when token expires.
//TODO - Context is lost on refresh due to state being reset.  Need to use local storage to get around this.
