import { ThemeProvider } from '@mui/material'

import { CssBaseline } from '@mui/material'
import React from 'react'
import { NavigationContainer } from '../navigation/NavigationContainer'
import { defaultTheme } from '../themes/default-theme'

function App() {
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <NavigationContainer />
      </ThemeProvider>
    </>
  )
}

export default App
