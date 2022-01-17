import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider, CssBaseline } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import React, { useEffect } from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'
import { User, UserState } from '../model/Model'
import { AuthService } from '../services/AuthService'
import { DataService } from '../services/DataService'
export const UserContext = React.createContext<UserState | null>(null)

const authService = new AuthService()
const dataService = new DataService()

function App() {
  const [user, setUser] = React.useState<User | null>(null)
  const [userContext, setUserContext] = React.useState<UserState | null>(null)

  const setAppUser = async (user: User | null) => {
    setUser(user)
    if (user) {
      const isAdmin = authService.isUserAdmin(user)
      if (isAdmin) {
        user.isAdmin = true
      }
      dataService.setUser(user)
      await authService.getAWSTemporaryCreds(user.cognitoUser)
    }
  }

  useEffect(() => {
    const getUserContextValue = async () => {
      if (user) {
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
        })
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
            <NavigationContainer setUser={setAppUser} user={user} />
          </UserContext.Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App

//TODO - Context is lost on refresh due to state being reset.  Need to use local storage to get around this.
