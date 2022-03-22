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

  // useEffect(() => {
  //   setValue('foodItemName', foodItem?.foodItemName)
  //   setValue('foodItemUnit', foodItem?.foodItemUnit)
  //   setValue('servingSize', foodItem?.servingSize)
  //   setValue('calories', foodItem?.calories)
  //   setValue('protein', foodItem?.protein)
  //   setValue('fat', foodItem?.fat)
  //   setValue('carbohydrates', foodItem?.carbohydrates)
  // }, [
  //   foodItem?.calories,
  //   foodItem?.carbohydrates,
  //   foodItem?.fat,
  //   foodItem?.foodItemName,
  //   foodItem?.foodItemUnit,
  //   foodItem?.protein,
  //   foodItem?.servingSize,
  //   setValue,
  // ])

  const { matchesMD } = useMediaQueries()
  // const foodItemUnit = watch('foodItemUnit')
  // const { mutate: createUserFoodItem, isLoading } = useMutation(
  //   (newFoodItem: UserFoodItem) => dataService.createUserFoodItem(newFoodItem),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries('userFoodItems')
  //       reset()
  //       setAddFoodDialogOpen(false)
  //     },
  //   }
  // )

  const generateFormTextInput = ({
    name,
    control,
    label,
    placeholder,
    disabled,
    required,
    type,
    inputProps,
  }: FormTextInputProps) => {
    return (
      <Grid
        item
        xs={12}
        container
        direction={'column'}
        sx={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '1rem',
        }}
      >
        <FormTextInput
          control={control}
          label={label}
          required={required}
          disabled={disabled}
          type={type}
          name={name}
          placeholder={placeholder}
          inputProps={inputProps}
        />
      </Grid>
    )
  }

  const foodItemUnitValues = [
    {
      name: 'Grams',
      value: 'GRAMS',
    },
    {
      name: 'Each',
      value: 'EACH',
    },
  ]

  const generateSelectInput = ({
    name,
    values,
    control,
    defaultValue,
    register,
    label,
    placeholder,
  }: FormSelectInputProps) => {
    return (
      <Grid
        item
        xs={12}
        container
        direction={'column'}
        sx={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '1rem',
        }}
      >
        <FormSelectInput
          control={control}
          register={register}
          placeholder={placeholder}
          label={label}
          name={name}
          defaultValue={defaultValue}
          values={values}
        />
      </Grid>
    )
  }

  // useEffect(() => {
  //   if (ingredients.length > 0) {
  //     const builderFoodItemValues: {
  //       quantity: number
  //       calories: number
  //       protein: number
  //       fat: number
  //       carbohydrates: number
  //     } = ingredients.reduce(
  //       (values, ingredient) => {
  //         return {
  //           ...values,
  //           quantity: values.quantity + ingredient.quantity,
  //           calories: values.calories + ingredient.calories,
  //           protein: values.protein + ingredient.protein,
  //           fat: values.fat + ingredient.fat,
  //           carbohydrates: values.carbohydrates + ingredient.carbohydrates,
  //         }
  //       },
  //       {
  //         quantity: 0,
  //         calories: 0,
  //         protein: 0,
  //         fat: 0,
  //         carbohydrates: 0,
  //       }
  //     )
  //     const { calories, protein, fat, carbohydrates, quantity } =
  //       builderFoodItemValues

  //     const dynamicAmount = foodItemUnit === 'EACH' ? 1 : quantity

  //     setValue('quantity', dynamicAmount)
  //     setValue('calories', calories)
  //     setValue('protein', protein)
  //     setValue('fat', fat)
  //     setValue('carbohydrates', carbohydrates)
  //   }
  // }, [foodItemUnit, ingredients, setValue])

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // const newFoodItemId = v4()

    const updatedFoodItem: UserFoodItem = {
      PK: foodItem?.PK!,
      SK: foodItem?.SK!,
      GSI2PK: foodItem?.GSI2PK!,
      GSI2SK: 'FOODS',
      type: 'FOOD',
      foodItemName: data.foodItemName,
      foodItemUnit: data.foodItemUnit,
      servingSize: parseFloat(data.quantity),
      calories: parseFloat(data.calories),
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbohydrates: parseFloat(data.carbohydrates),
      foodItemId: foodItem?.foodItemId!,
    }

    // createUserFoodItem(newFoodItem)
  }

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
