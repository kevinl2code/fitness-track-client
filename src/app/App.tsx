import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider, CssBaseline } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'
import { AuthService } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { QueryCache, useQueryClient } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorPage } from '../pages/ErrorPage'
import { useStore } from '../store/useStore'
import { AppLoadingPage } from '../pages/AppLoadingPage'
import { DataService } from '../services/DataService'

const authService = new AuthService()
export const dataService = new DataService()

function App() {
  const { removeUser } = useStore((state) => state.userSlice)

  const navigate = useNavigate()
  const queryCache = new QueryCache()
  const queryClient = useQueryClient()

  window.onerror = (e) => {
    console.log(e)
  }

  const handleLogout = () => {
    queryCache.clear()
    queryClient.removeQueries('cycles')
    queryClient.removeQueries('dailyEntries')
    authService.logOut()
    removeUser()
    navigate('/')
    window.location.reload()
  }

  const isLoading = false
  return isLoading ? (
    <AppLoadingPage color={'#f0f4f7'} />
  ) : (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={DateAdapter} locale={'enLocale'}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <NavigationContainer handleLogout={handleLogout} />
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App

//TODO - Need to remove authenticated state when token expires.
//TODO - Context is lost on refresh due to state being reset.  Need to use local storage to get around this.
