import {
  Button,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
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

export const DailyEntryMetricView: React.FC<Props> = ({
  fieldType,
  fieldLabel,
  fieldValue,
  canEdit = true,
  openDialog,
}) => {
  return (
    <Grid item>
      <Grid container direction="column" alignItems={'center'}>
        <Grid item>
          <Button
            size="small"
            sx={{ fontSize: '1.1rem', textTransform: 'none' }}
            onClick={canEdit ? openDialog : () => null}
          >
            {fieldValue}
          </Button>
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: '.9rem', textTransform: 'none' }}>
            {fieldLabel}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
