import { createTheme } from '@mui/material'
import type {} from '@mui/lab/themeAugmentation'

// Palette From
// https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=81D4FA&secondary.color=CE93D8

export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#81d4fa',
      light: '##b6ffff',
      dark: '#4ba3c7',
    },
    secondary: {
      main: '#ce93d8',
      light: '#ffc4ff',
      dark: '#9c64a6',
    },
  },
})
