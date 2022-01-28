import { CardContent, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import EditIcon from '@mui/icons-material/Edit'
import { useMediaQueries } from '../../utilities/useMediaQueries'

type CardFieldType = 'weight' | 'activity'

interface Props {
  fieldType: CardFieldType
  fieldLabel: string
  fieldValue: string
  canEdit?: boolean
  openDialog?: () => void
}

export const DailyEntryCardItem: React.FC<Props> = ({
  fieldType,
  fieldLabel,
  fieldValue,
  canEdit = true,
  openDialog,
}) => {
  const { matchesMD } = useMediaQueries()
  const primaryIcon = {
    weight: <MonitorWeightOutlinedIcon fontSize="large" />,
    activity: <DirectionsRunIcon fontSize="large" />,
  }

  return (
    <CardContent
      sx={[
        !matchesMD && {
          paddingLeft: '4px',
        },
      ]}
    >
      <Grid container alignItems={'center'}>
        <Grid item xs={1} md={1}>
          <Grid>{primaryIcon[fieldType]}</Grid>
        </Grid>
        <Grid
          item
          xs={4}
          md={3}
          sx={[
            !matchesMD && {
              paddingLeft: '4px',
            },
          ]}
        >
          <Typography>{fieldLabel}</Typography>
        </Grid>
        <Grid item xs={6} md={7}>
          <Typography sx={{ textAlign: 'end', paddingRight: '1rem' }}>
            {fieldValue}
          </Typography>
        </Grid>
        <Grid item xs={1} md={1}>
          {canEdit && (
            <IconButton onClick={openDialog}>
              <EditIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </CardContent>
  )
}
