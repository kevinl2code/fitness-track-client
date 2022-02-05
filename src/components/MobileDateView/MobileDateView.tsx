import { Paper, Grid, IconButton, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import React from 'react'
import { DateTime } from 'luxon'

interface Props {
  pickerDate: DateTime
  minDate: DateTime
  setPickerDate: React.Dispatch<React.SetStateAction<DateTime>>
  setDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const today = DateTime.now()

export const MobileDateView: React.FC<Props> = ({
  pickerDate,
  minDate,
  setPickerDate,
  setDatePickerOpen,
}) => {
  const mobileDateViewStartPosition =
    document.getElementById('dailyEntryPageMobileDateView')?.getClientRects()[0]
      .top! - 1

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
    if (pickerDate.endOf('day').valueOf() === today.endOf('day').valueOf()) {
      return null
    }
    setPickerDate(pickerDate?.plus({ days: 1 }))
  }

  return (
    <Paper
      square
      id="dailyEntryPageMobileDateView"
      sx={{
        width: '100%',
        backgroundColor: 'primary.main',
        border: 'none',
        padding: '1rem 1rem 0 1rem',
        position: 'sticky',
        top: mobileDateViewStartPosition,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Grid container justifyContent="space-between">
        <IconButton aria-label="delete" size="small" onClick={stepDateBack}>
          <NavigateBeforeIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography
          color={'white'}
          variant="h5"
          onClick={() => setDatePickerOpen(true)}
        >
          {pickerDate?.toFormat('MMMM dd')}
        </Typography>
        <IconButton aria-label="delete" size="small" onClick={stepDateForward}>
          <NavigateNextIcon sx={{ color: 'white' }} />
        </IconButton>
      </Grid>
    </Paper>
  )
}
