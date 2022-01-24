import { createTheme } from '@mui/material'
import type {} from '@mui/lab/themeAugmentation'

// Palette From
// https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=81D4FA&secondary.color=CE93D8

export const defaultTheme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#81d4fa',
  //     light: '##b6ffff',
  //     dark: '#4ba3c7',
  //   },
  //   secondary: {
  //     main: '#ce93d8',
  //     light: '#ffc4ff',
  //     dark: '#9c64a6',
  //   },
  // },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: 'blue',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        // root: {
        //   '&.MuiTabs-indicator': {
        //     backgroundColor: '#ffffff',
        //   },
        // },
        indicator: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
})

// '& .MuiButtonBase-root-MuiTab-root.Mui-selected': {
//   backgroundColor: '#ffffff',
//   color: 'blue',
//   borderTopLeftRadius: '15px',
//   borderTopRightRadius: '15px',
// }
