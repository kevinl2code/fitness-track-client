import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { v4 } from 'uuid'
import * as yup from 'yup'
import { FoodItemUnits, UserFoodItem, UserState } from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
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
  dataService: DataService
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type EntryMethod = 'BUILDER' | 'CUSTOM' | null

const validationSchema = yup.object({
  // foodItemName regex specifies string cannot start with space or special characters
  foodItemName: yup
    .string()
    .matches(/^[a-z0-9](?!.*?[^\na-z0-9]{2})/i, 'Please enter a valid name')
    .min(3)
    .max(40)
    .required(),
  foodItemUnit: yup
    .string()
    .typeError('Selection required')
    .matches(/^GRAMS$|^OUNCES$|^EACH$/g, 'Selection required'),
  servingSize: yup
    .number()
    .typeError('Serving size required')
    .min(1, 'Must be over 1')
    .max(2000, 'Must be under 2000')
    .positive()
    .integer()
    .required('Serving size required'),
  calories: yup
    .number()
    .typeError('Calories required')
    .min(0, 'Must be at least 0')
    .max(10000, 'Must be 10000 or less')
    .positive()
    .required('Calories required'),
  protein: yup
    .number()
    .typeError('Protein required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .positive()
    .required('Protein required'),
  fat: yup
    .number()
    .typeError('Fat required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .positive()
    .required('Fat required'),
  carbohydrates: yup
    .number()
    .typeError('Carbohydrates required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .positive()
    .required('Carbohydrates required'),
})

export const AddUserFoodItemDialog: React.FC<Props> = ({
  open,
  user,
  dataService,
  setAddFoodDialogOpen,
}) => {
  const [entryMethod, setEntryMethod] = useState<EntryMethod>(null)
  const { matchesMD } = useMediaQueries()

  const handleCancel = () => {
    setAddFoodDialogOpen(false)
    setEntryMethod(null)
  }

  return (
    <Dialog open={open} fullScreen={!matchesMD}>
      <DialogTitle>
        {' '}
        {entryMethod === 'BUILDER' ? 'Build A Food Item' : 'Create A Food Item'}
      </DialogTitle>
      <Grid container sx={{ height: '100%' }}>
        <DialogContent sx={{ paddingBottom: 0 }}>
          {entryMethod === null && (
            <Grid container direction={matchesMD ? 'row' : 'column'}>
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
              dataService={dataService}
              setAddFoodDialogOpen={setAddFoodDialogOpen}
            />
          )}
          {entryMethod === 'BUILDER' && (
            <AddFoodBuilderUserFoodItemForm
              user={user}
              dataService={dataService}
              setAddFoodDialogOpen={setAddFoodDialogOpen}
            />
          )}
          <Grid item xs={12} container justifyContent="center">
            <Button
              onClick={() => handleCancel()}
              sx={{ marginBottom: '1rem' }}
            >
              Cancel
            </Button>
          </Grid>
        </DialogContent>
      </Grid>
    </Dialog>
  )
}
