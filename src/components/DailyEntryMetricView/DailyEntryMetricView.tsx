import { Button, Grid, Typography } from '@mui/material'
import React from 'react'

interface Props {
  fieldLabel: string
  fieldValue: string
  canEdit?: boolean
  openDialog?: () => void
}

export const DailyEntryMetricView: React.FC<Props> = ({
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
