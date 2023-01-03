import { Box, Container, Toolbar } from '@mui/material'
import React from 'react'
import { useQuery } from 'react-query'
import { Outlet } from 'react-router-dom'
import { MainBottomNavigation } from '../components/MainBottomNavigation'
import { Cycle, UserState } from '../model/Model'
import { AppLoadingPage } from '../pages/AppLoadingPage'
import { AuthService } from '../services/AuthService'
import { dataService } from '../app/App'
// import { DataService } from '../services/DataService'
import { useStore } from '../store/useStore'
import { Sort } from '../utilities/Sort'

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)
const twentyFourHoursInMs = 1000 * 60 * 60 * 24
const authService = new AuthService()

// const dataService = new DataService()

export const AuthLayout: React.FC = ({ children }) => {
  const { credentials } = useStore((state) => state.credentialsSlice)
  const { userData, bootstrapUser, removeUser } = useStore(
    (state) => state.userSlice
  )
  const { setUserFoodItems } = useStore((state) => state.userFoodItemsSlice)
  const { setCycleList } = useStore((state) => state.cycleListSlice)
  const { selectedCycle, setSelectedCycle } = useStore(
    (state) => state.selectedCycleSlice
  )
  const { setEntries } = useStore((state) => state.entriesSlice)

  const sort = new Sort()

  const handleBootstrapUser = async () => {
    if (credentials) {
      const isAdmin = authService.isUserAdmin(credentials)
      if (isAdmin) {
        credentials.isAdmin = true
      }
      dataService.setUser(credentials)
      authService.getAWSTemporaryCreds(credentials.cognitoUser)
      const userInfo = await authService.currentUserInfo()
      const userState: UserState = {
        user: {
          userName: userInfo.username,
          cognitoUser: credentials.cognitoUser,
          isAdmin: credentials.isAdmin,
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
    }
  }

  if (credentials && !userData) {
    handleBootstrapUser()
  }

  const { isLoading: userFoodItemsLoading, data: fetchedUserFoodItems } =
    useQuery(
      ['userFoodItems'],
      () => dataService.getUserFoodItems(userData?.sub!),
      {
        enabled: !!userData,
        onSuccess: (data) => {
          if (data) {
            setUserFoodItems(data)
          }
        },
        onError: (error) => {
          console.log(`Network Error: ${error}`)
        },
      }
    )

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

  if (!credentials) {
    removeUser()
  }

  const isLoading =
    cyclesLoading || dailyEntriesLoading || userFoodItemsLoading || !userData

  return isLoading ? (
    <AppLoadingPage color={'#f0f4f7'} />
  ) : (
    <Container sx={{ display: 'flex', height: vh }} disableGutters={true}>
      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Outlet />
        <Toolbar />
      </Box>

      <MainBottomNavigation />
    </Container>
  )
}
