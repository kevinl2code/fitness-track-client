import { LocalizationProvider } from '@mui/lab'
import { ThemeProvider } from '@mui/material'
import DateAdapter from '@mui/lab/AdapterLuxon'
import { CssBaseline } from '@mui/material'
import React from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />

        <LocalizationProvider dateAdapter={DateAdapter}>
          <NavigationContainer />
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}

export default App
