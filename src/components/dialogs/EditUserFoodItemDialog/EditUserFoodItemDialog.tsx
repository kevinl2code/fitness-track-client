import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'
import * as yup from 'yup'
import { UserContext } from '../../../app/App'
import {
  FitnessTrackFoodItem,
  FoodBuilderIngredient,
  FoodItemUnits,
  UserFoodItem,
  UserState,
} from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { IngredientsInput } from '../../IngredientsInput'
import { FoodBuilderSelectorDialog } from '../AddUserFoodItemDialog/FoodBuilderSelectorDialog'
import { EditCustomUserFoodItemForm } from './EditCustomUserFoodItemForm'

interface IFormInput {
  foodItemName: string
  foodItemUnit: FoodItemUnits
  quantity: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
  foodItemReference: string
}
interface Props {
  open: boolean
  foodItem: UserFoodItem | null
  setEditFoodDialogOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      foodItem: UserFoodItem | null
    }>
  >
}

export const EditUserFoodItemDialog: React.FC<Props> = ({
  open,
  foodItem,
  setEditFoodDialogOpen,
}) => {
  const [foodSelectorOpen, setFoodSelectorOpen] = useState(false)
  const [ingredients, setIngredients] = useState<FoodBuilderIngredient[]>([])

  const user = useContext(UserContext)
  const dataService = new DataService()
  const queryClient = useQueryClient()

  dataService.setUser(user?.user!)

  const { matchesMD } = useMediaQueries()

  const handleCancel = () => {
    setEditFoodDialogOpen({
      open: false,
      foodItem: null,
    })
  }

  if (!foodItem) {
    return null
  }

  return (
    <>
      <FoodBuilderSelectorDialog
        open={foodSelectorOpen}
        ingredients={ingredients}
        setIngredients={setIngredients}
        setOpen={setFoodSelectorOpen}
      />
      <Dialog open={open} fullScreen={!matchesMD}>
        <DialogTitle> {'Edit Food Item'}</DialogTitle>
        <Grid container sx={{ height: '100%' }}>
          <DialogContent sx={{ paddingBottom: 0 }}>
            <EditCustomUserFoodItemForm
              foodItem={foodItem}
              dataService={dataService}
              setEditFoodDialogOpen={setEditFoodDialogOpen}
            />
            <Grid item xs={12} container justifyContent="center">
              <Grid item xs={12} container justifyContent="center">
                <Button
                  onClick={() => handleCancel()}
                  sx={{ marginBottom: '1rem' }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Grid>
      </Dialog>
    </>
  )
}
