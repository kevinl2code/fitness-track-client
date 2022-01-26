import { useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

enum Orientation {
  Landscape,
  Portrait,
}

const isLandscape = window.innerWidth > window.innerHeight

export const useMediaQueries = () => {
  const theme = useTheme()

  const currentOrientation = isLandscape
    ? Orientation.Landscape
    : Orientation.Portrait

  const [orientation, setOrientation] =
    useState<Orientation>(currentOrientation)

  const onOrientationChangeEvent = (event: Event) => {
    const isLandscape = window.innerWidth > window.innerHeight
    !isLandscape
      ? setOrientation(Orientation.Landscape)
      : setOrientation(Orientation.Portrait)
  }

  useEffect(() => {
    window.addEventListener('orientationchange', onOrientationChangeEvent, true)
    return () => {
      window.removeEventListener(
        'orientationchange',
        onOrientationChangeEvent,
        true
      )
    }
  }, [])

  const matchesXS = useMediaQuery(theme.breakpoints.up('xs'))
  const matchesSM = useMediaQuery(theme.breakpoints.up('sm'))
  const matchesMD = useMediaQuery(theme.breakpoints.up('md'))
  const matchesLG = useMediaQuery(theme.breakpoints.up('lg'))
  const matchesXL = useMediaQuery(theme.breakpoints.up('xl'))

  return {
    matchesXS,
    matchesSM,
    matchesMD,
    matchesLG,
    matchesXL,
    orientation,
  }
}
