import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import { CssBaseline } from '@mui/material'
import React from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'

// export const UserContext = React.createContext(user)

function App() {
  const [user, setUser] = React.useState<string | null>(null)

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={DateAdapter}>
          {/* <UserContext.Provider value={user}> */}
          <NavigationContainer user={user} setUser={setUser} />
          {/* </UserContext.Provider> */}
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App
