import { Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useQueryClient } from 'react-query'
import { UserContext } from '../../../app/App'
import {
  FoodBuilderIngredient,
  FoodItemUnits,
  UserFoodItem,
} from '../../../model/Model'
import { DataService } from '../../../services/DataService'
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

  const user = useContext(UserContext)
  const dataService = new DataService()

  dataService.setUser(user?.user!)

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
        <Grid container sx={{ height: '100%' }}>
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
