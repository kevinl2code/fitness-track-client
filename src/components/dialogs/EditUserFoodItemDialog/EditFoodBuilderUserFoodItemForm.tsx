import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { v4 } from 'uuid'
import * as yup from 'yup'
import {
  FoodBuilderIngredient,
  FoodItemUnits,
  UserFoodItem,
} from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { IngredientsInput } from '../../IngredientsInput'
import { FoodBuilderSelectorDialog } from '../AddUserFoodItemDialog/FoodBuilderSelectorDialog'

interface Props {
  foodItem: UserFoodItem | null
  dataService: DataService
  setEditFoodDialogOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      foodItem: UserFoodItem | null
    }>
  >
}

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
  quantity: yup
    .number()
    .typeError('Quantity required')
    .min(1, 'Must be at least 1')
    .max(2000, 'Must be under 2000')
    .required('Serving size required'),
  calories: yup
    .number()
    .typeError('Calories required')
    .min(0, 'Must be at least 0')
    .max(10000, 'Must be 10000 or less')
    .required('Calories required'),
  protein: yup
    .number()
    .typeError('Protein required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Protein required'),
  fat: yup
    .number()
    .typeError('Fat required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Fat required'),
  carbohydrates: yup
    .number()
    .typeError('Carbohydrates required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Carbohydrates required'),
})

export const EditFoodBuilderUserFoodItemForm: React.FC<Props> = ({
  foodItem,
  dataService,
  setEditFoodDialogOpen,
}) => {
  const [foodSelectorOpen, setFoodSelectorOpen] = useState(false)
  const [ingredients, setIngredients] = useState<FoodBuilderIngredient[]>(
    foodItem?.ingredients || []
  )
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const queryClient = useQueryClient()
  const foodItemUnit = watch('foodItemUnit')

  useEffect(() => {
    setValue('foodItemName', foodItem?.foodItemName)
    setValue('foodItemUnit', foodItem?.foodItemUnit)
    setValue('servingSize', foodItem?.servingSize)

    // setValue('calories', foodItem?.calories)
    // setValue('protein', foodItem?.protein)
    // setValue('fat', foodItem?.fat)
    // setValue('carbohydrates', foodItem?.carbohydrates)
  }, [
    foodItem?.foodItemName,
    foodItem?.foodItemUnit,
    foodItem?.servingSize,
    setValue,
  ])

  useEffect(() => {
    if (ingredients.length > 0) {
      const builderFoodItemValues: {
        quantity: number
        calories: number
        protein: number
        fat: number
        carbohydrates: number
      } = ingredients.reduce(
        (values, ingredient) => {
          return {
            ...values,
            quantity: values.quantity + ingredient.quantity,
            calories: values.calories + ingredient.calories,
            protein: values.protein + ingredient.protein,
            fat: values.fat + ingredient.fat,
            carbohydrates: values.carbohydrates + ingredient.carbohydrates,
          }
        },
        {
          quantity: 0,
          calories: 0,
          protein: 0,
          fat: 0,
          carbohydrates: 0,
        }
      )
      const { calories, protein, fat, carbohydrates, quantity } =
        builderFoodItemValues

      const dynamicAmount = foodItemUnit === 'EACH' ? 1 : quantity

      setValue('quantity', dynamicAmount)
      setValue('calories', calories)
      setValue('protein', protein)
      setValue('fat', fat)
      setValue('carbohydrates', carbohydrates)
    } else if (ingredients.length === 0) {
      setValue('quantity', 0)
      setValue('calories', 0)
      setValue('protein', 0)
      setValue('fat', 0)
      setValue('carbohydrates', 0)
    }
  }, [foodItemUnit, ingredients, setValue])

  const { mutate: updateFoodItem, isLoading } = useMutation(
    (updatedFoodItem: UserFoodItem) =>
      dataService.updateUserFoodItem(updatedFoodItem),
    {
      onSuccess: () => {
        // fetchFoodItems()
        queryClient.invalidateQueries('userFoodItems')
        setEditFoodDialogOpen({
          open: false,
          foodItem: null,
        })
      },
    }
  )

  if (!foodItem) {
    return null
  }

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
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const updatedFoodItem: UserFoodItem = {
      PK: foodItem?.PK,
      SK: foodItem?.SK,
      GSI2PK: foodItem?.GSI2PK,
      GSI2SK: foodItem?.GSI2SK,
      type: foodItem.type,
      foodItemName: data.foodItemName,
      foodItemUnit: data.foodItemUnit,
      servingSize: parseFloat(data.quantity),
      calories: parseFloat(data.calories),
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbohydrates: parseFloat(data.carbohydrates),
      ingredients: ingredients,
      foodItemId: foodItem?.foodItemId,
    }

    updateFoodItem(updatedFoodItem)
  }

  return (
    <>
      <FoodBuilderSelectorDialog
        open={foodSelectorOpen}
        ingredients={ingredients}
        setIngredients={setIngredients}
        setOpen={setFoodSelectorOpen}
      />
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container justifyContent="center">
          {generateFormTextInput({
            name: 'foodItemName',
            control: control,
            label: 'Food Name',
            placeholder: 'Food Name',
          })}
          <IngredientsInput
            ingredients={ingredients}
            setIngredients={setIngredients}
            setFoodSelectorOpen={setFoodSelectorOpen}
          />
          {generateSelectInput({
            name: 'foodItemUnit',
            values: foodItemUnitValues,
            defaultValue: 'GRAMS',
            label: 'Food Units',
            control: control,
            register: register,
          })}
          {generateFormTextInput({
            name: 'quantity',
            control: control,
            type: 'number',
            label: 'Quantity',
            placeholder: 'Quantity',
            disabled: true,
          })}
          {generateFormTextInput({
            name: 'calories',
            control: control,
            type: 'number',
            label: 'Calories',
            placeholder: 'Calories',
            disabled: true,
          })}
          {generateFormTextInput({
            name: 'protein',
            control: control,
            type: 'number',
            label: 'Protein',
            placeholder: 'Protein',
            disabled: true,
          })}
          {generateFormTextInput({
            name: 'fat',
            control: control,
            type: 'number',
            label: 'Fat',
            placeholder: 'Fat',
            disabled: true,
          })}
          {generateFormTextInput({
            name: 'carbohydrates',
            control: control,
            type: 'number',
            label: 'Carbohydrates',
            placeholder: 'Carbohydrates',
            disabled: true,
          })}
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Button
            variant="contained"
            type="submit"
            sx={{ marginTop: '1rem', marginBottom: '1rem' }}
          >
            Update
          </Button>
        </Grid>
      </form>
    </>
  )
}
