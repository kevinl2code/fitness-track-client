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

export const UserContext = React.createContext<UserState | null>(null)

const authService = new AuthService()

function App() {
  const [user, setUser] = React.useState<CognitoUser | null>(null)
  const [userContext, setUserContext] = React.useState<UserState | null>(null)

  useEffect(() => {
    const getUserContextValue = async () => {
      if (user) {
        const userInfo = await authService.currentUserInfo()
        setUserContext({
          userName: userInfo.username,
          firstName: userInfo.attributes.given_name,
          lastName: userInfo.attributes.family_name,
          sex: userInfo.attributes.gender,
          height: parseInt(userInfo.attributes['custom:height']),
          birthday: userInfo.attributes.birthdate,
          email: userInfo.attributes.email,
        })

        console.log(userInfo)
      }
    }
    getUserContextValue()
  }, [user])

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={DateAdapter}>
          <UserContext.Provider value={userContext}>
            <NavigationContainer setUser={setUser} />
          </UserContext.Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App

//TODO - Context is lost on refresh due to state being reset.  Need to use local storage to get around this.
