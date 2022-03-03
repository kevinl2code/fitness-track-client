import { Grid, IconButton, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import React from 'react'
import { DateTime } from 'luxon'

interface Props {
  pickerDate: DateTime
  minDate: DateTime
  maxDate: DateTime
  setPickerDate: React.Dispatch<React.SetStateAction<DateTime>>
  setDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const MobileDateView: React.FC<Props> = ({
  pickerDate,
  minDate,
  maxDate,
  setPickerDate,
  setDatePickerOpen,
}) => {
  const stepDateBack = () => {
    if (!pickerDate) {
      return null
    }
    if (pickerDate.endOf('day').valueOf() === minDate.endOf('day').valueOf()) {
      return null
    }
    setPickerDate(pickerDate?.minus({ days: 1 }))
  }
  const stepDateForward = () => {
    if (!pickerDate) {
      return null
    }
    if (pickerDate.endOf('day').valueOf() === maxDate.endOf('day').valueOf()) {
      return null
    }
    setPickerDate(pickerDate?.plus({ days: 1 }))
  }

  return (
    <Grid
      container
      justifyContent="space-between"
      sx={[
        {
          width: '100%',
          height: '60px',
          backgroundColor: 'white',
          border: 'none',
          padding: '1rem 1rem 0 1rem',
          position: 'sticky',
          top: -1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        },
      ]}
    >
      <IconButton aria-label="delete" size="small" onClick={stepDateBack}>
        <NavigateBeforeIcon sx={{ color: 'primary.main' }} />
      </IconButton>
      <Typography
        color={'primary.main'}
        variant="h5"
        onClick={() => setDatePickerOpen(true)}
      >
        {pickerDate?.toFormat('MMMM dd')}
      </Typography>
      <IconButton aria-label="delete" size="small" onClick={stepDateForward}>
        <NavigateNextIcon sx={{ color: 'primary.main' }} />
      </IconButton>
    </Grid>
  )
}
