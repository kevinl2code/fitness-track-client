import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { DateTime } from 'luxon'
import React, { useContext } from 'react'
import { CycleListContext } from '../../app/App'
import { AppSettingsDisplayPlanDialog } from '../../components/dialogs/AppSettingsDisplayPlanDialog'
import { MorePagesBackNavigation } from '../../components/MorePagesBackNavigation'
import { useStore } from '../../store/useStore'

export const AppSettingsPage: React.FC = () => {
  const { selectedCycle } = useStore((state) => state.selectedCycleSlice)
  const [
    openAppSettingsDisplayPlanDialog,
    setOpenAppSettingsDisplayPlanDialog,
  ] = React.useState(false)
  const cycles = useContext(CycleListContext)

  const displayPlanFormattedValue = selectedCycle?.isActive
    ? 'Current'
    : `${DateTime.fromISO(selectedCycle?.startDate!).toFormat(
        'MMM dd'
      )} - ${DateTime.fromISO(selectedCycle?.endingDate!).toFormat('MMM dd')}`

  return (
    <>
      <AppSettingsDisplayPlanDialog
        open={openAppSettingsDisplayPlanDialog}
        selectedCycle={selectedCycle}
        cycles={cycles}
        setDialogOpenState={setOpenAppSettingsDisplayPlanDialog}
      />
      <Grid container justifyContent="center">
        <MorePagesBackNavigation />
      </Grid>
      <Container>
        <Grid container direction="column" alignItems="center" rowSpacing={2}>
          <Grid item sx={{ width: '100%' }}>
            <DisplayCard subject="Measurement Units" value="Metric" />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <DisplayCard
              subject="Display Plan"
              value={displayPlanFormattedValue}
              action={setOpenAppSettingsDisplayPlanDialog}
            />
          </Grid>
          <Grid item sx={{ width: '100%' }}>
            <DisplayCard subject="Account Type" value="Free with Ads" />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

interface DisplayCardProps {
  subject: string
  value: string | undefined
  action?: React.Dispatch<React.SetStateAction<boolean>>
}

const DisplayCard: React.FC<DisplayCardProps> = ({
  subject,
  value,
  action,
}) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Grid item container alignItems="center">
          <Grid item xs={6}>
            <Typography textAlign="left">{`${subject}:`}</Typography>
          </Grid>
          <Grid item container xs={6} justifyContent="flex-end">
            {/* <Typography textAlign="right">{`${value}`}</Typography> */}
            <Button
              size="small"
              sx={{
                fontSize: '1.1rem',
                textTransform: 'none',
              }}
              onClick={action ? () => action(true) : () => null}
            >
              {`${value}`}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
