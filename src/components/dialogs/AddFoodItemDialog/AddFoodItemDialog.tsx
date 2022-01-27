import { Button, Dialog } from '@mui/material'
import React from 'react'
import { useMediaQueries } from '../../../utilities/useMediaQueries'

interface Props {
  open: boolean
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddFoodItemDialog: React.FC<Props> = ({
  open,
  setAddFoodDialogOpen,
}) => {
  const { matchesMD } = useMediaQueries()

  return (
    <Dialog open={open} fullScreen={!matchesMD}>
      <Button onClick={() => setAddFoodDialogOpen(false)}>Close</Button>
    </Dialog>
  )
}
