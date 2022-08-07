import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import React, { useState } from 'react'
import {
  FoodBuilderIngredient,
  FoodItemUnits,
  UserFoodItem,
} from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useStore } from '../../../store/useStore'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FoodBuilderSelectorDialog } from '../AddUserFoodItemDialog/FoodBuilderSelectorDialog'
import { EditCustomUserFoodItemForm } from './EditCustomUserFoodItemForm'
import { EditFoodBuilderUserFoodItemForm } from './EditFoodBuilderUserFoodItemForm'

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
  const { userData } = useStore((state) => state.userSlice)

  const dataService = new DataService()

  dataService.setUser(userData?.user!)

  const handleCancel = () => {
    setEditFoodDialogOpen({
      open: false,
      foodItem: null,
    })
  }

  if (!foodItem) {
    return null
  }

  const isFoodBuilderFoodItem = foodItem.ingredients !== undefined

  return (
    <>
      <FoodBuilderSelectorDialog
        open={foodSelectorOpen}
        ingredients={ingredients}
        setIngredients={setIngredients}
        setOpen={setFoodSelectorOpen}
      />
      <Dialog open={open} fullScreen={true}>
        <DialogTitle> {'Edit Food Item'}</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          {isFoodBuilderFoodItem ? (
            <EditFoodBuilderUserFoodItemForm
              foodItem={foodItem}
              dataService={dataService}
              setEditFoodDialogOpen={setEditFoodDialogOpen}
            />
          ) : (
            <EditCustomUserFoodItemForm
              foodItem={foodItem}
              dataService={dataService}
              setEditFoodDialogOpen={setEditFoodDialogOpen}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancel()} sx={{ marginBottom: '1rem' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
