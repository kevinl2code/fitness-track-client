import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import { CssBaseline } from '@mui/material'
import React, { useEffect } from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'
import { UserState } from '../model/Model'
import { AuthService } from '../services/AuthService'
import { CognitoUser } from '@aws-amplify/auth'

export const UserContext = React.createContext(null)

const authService = new AuthService()

function App() {
  const [user, setUser] = React.useState<CognitoUser | null>(null)
  const [userContext, setUserContext] = React.useState<UserState | null>(null)
  let userContextValue = null

  if (user) {
  }

  useEffect(() => {
    const getUserContextValue = async () => {
      if (user) {
        const innerUserContextValue = await authService.getUserAttributes(user)
        // setUserContext({
        //   userName: innerUserContextValue[0].Value
        // })
        console.log(innerUserContextValue)
      }
    }
    const userValue = getUserContextValue()
    // setUserContext(userValue)
  })

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={DateAdapter}>
          {/* <UserContext.Provider value={user}> */}
          <NavigationContainer setUser={setUser} />
          {/* </UserContext.Provider> */}
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App
