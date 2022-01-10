import { CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import EditIcon from '@mui/icons-material/Edit'

type CardFieldType = 'weight' | 'activity'

interface Props {
  fieldType: CardFieldType
  fieldLabel: string
  fieldValue: string
}

export const DailyEntryCardItem: React.FC<Props> = ({
  fieldType,
  fieldLabel,
  fieldValue,
}) => {
  const primaryIcon = {
    weight: <MonitorWeightOutlinedIcon fontSize="large" />,
    activity: <DirectionsRunIcon fontSize="large" />,
  }

  return (
    <CardContent>
      <Grid container alignItems={'center'}>
        <Grid item xs={1}>
          <Grid>{primaryIcon[fieldType]}</Grid>
        </Grid>
        <Grid item xs={3}>
          <Typography>{fieldLabel}</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography sx={{ textAlign: 'end', paddingRight: '1rem' }}>
            {fieldValue}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <EditIcon />
        </Grid>
      </Grid>
    </CardContent>
  )
}
