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
  UserState,
} from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { IngredientsInput } from '../../IngredientsInput'
import { FoodBuilderSelectorDialog } from './FoodBuilderSelectorDialog'

interface Props {
  user: UserState
  dataService: DataService
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
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

export const AddFoodBuilderUserFoodItemForm: React.FC<Props> = ({
  user,
  dataService,
  setAddFoodDialogOpen,
}) => {
  const [foodSelectorOpen, setFoodSelectorOpen] = useState(false)
  const [ingredients, setIngredients] = useState<FoodBuilderIngredient[]>([])
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
  const { matchesMD } = useMediaQueries()
  const queryClient = useQueryClient()
  const foodItemUnit = watch('foodItemUnit')
  const { mutate: createUserFoodItem, isLoading } = useMutation(
    (newFoodItem: UserFoodItem) => dataService.createUserFoodItem(newFoodItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userFoodItems')
        reset()
        setAddFoodDialogOpen(false)
      },
    }
  )

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

  console.log({ ingredients: ingredients })
  console.log({ unit: foodItemUnit })
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
    }
  }, [foodItemUnit, ingredients, setValue])

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newFoodItemId = v4()

    const newFoodItem: UserFoodItem = {
      PK: user.sub,
      SK: `F_${newFoodItemId}`,
      GSI2PK: `U_${user.sub}`,
      GSI2SK: 'FOODS',
      type: 'FOOD',
      foodItemName: data.foodItemName,
      foodItemUnit: data.foodItemUnit,
      servingSize: parseFloat(data.quantity),
      calories: parseFloat(data.calories),
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbohydrates: parseFloat(data.carbohydrates),
      foodItemId: newFoodItemId,
    }

    createUserFoodItem(newFoodItem)
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
            sx={[
              { marginTop: '1rem', marginBottom: '1rem' },
              matchesMD && { marginTop: 0 },
            ]}
          >
            Create
          </Button>
        </Grid>
      </form>
    </>
  )
}
