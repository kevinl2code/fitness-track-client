import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import React, { useState } from 'react'
import { FoodItemUnits, UserState } from '../../../model/Model'
import { AddCustomUserFoodItemForm } from './AddCustomUserFoodItemForm'
import { AddFoodBuilderUserFoodItemForm } from './AddFoodBuilderUserFoodItemForm'

interface IFormInput {
  foodItemName: string
  foodItemUnit: FoodItemUnits
  servingSize: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
  foodItemReference: string
}

interface Props {
  open: boolean
  user: UserState
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type EntryMethod = 'BUILDER' | 'CUSTOM' | null

export const AddUserFoodItemDialog: React.FC<Props> = ({
  open,
  user,
  setAddFoodDialogOpen,
}) => {
  const [entryMethod, setEntryMethod] = useState<EntryMethod>(null)

  const handleCancel = () => {
    setAddFoodDialogOpen(false)
    setEntryMethod(null)
  }

  return (
    <Dialog open={open} fullScreen={true}>
      <DialogTitle>
        {' '}
        {entryMethod === 'BUILDER' ? 'Build A Food Item' : 'Create A Food Item'}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        {entryMethod === null && (
          <Grid container direction={'column'}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('BUILDER')}
              sx={{ marginBottom: '1rem' }}
            >
              Food Builder
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setEntryMethod('CUSTOM')}
              sx={{ marginBottom: '1rem' }}
            >
              Custom
            </Button>
          </Grid>
        )}
        {entryMethod === 'CUSTOM' && (
          <AddCustomUserFoodItemForm
            user={user}
            setAddFoodDialogOpen={setAddFoodDialogOpen}
          />
        )}
        {entryMethod === 'BUILDER' && (
          <AddFoodBuilderUserFoodItemForm
            user={user}
            setAddFoodDialogOpen={setAddFoodDialogOpen}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancel()} sx={{ marginBottom: '1rem' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
