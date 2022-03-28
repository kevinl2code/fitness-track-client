import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { FoodItemUnits, UserFoodItem } from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import {
  FormTextInput,
  FormTextInputProps,
} from '../../form/FormTextInput/FormTextInput'

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
  servingSize: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
}

const validationSchema = yup.object({
  foodItemName: yup.string().max(80).required(),
  foodItemUnit: yup
    .string()
    .typeError('Selection required')
    .matches(/^GRAMS$|^OUNCES$|^EACH$/g, 'Selection required'),
  servingSize: yup
    .number()
    .typeError('Serving size required')
    .min(1, 'Must be over 1')
    .max(2000, 'Must be under 2000')
    .integer()
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

export const EditCustomUserFoodItemForm: React.FC<Props> = ({
  foodItem,
  dataService,
  setEditFoodDialogOpen,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const queryClient = useQueryClient()

  useEffect(() => {
    setValue('foodItemName', foodItem?.foodItemName)
    setValue('foodItemUnit', foodItem?.foodItemUnit)
    setValue('servingSize', foodItem?.servingSize)
    setValue('calories', foodItem?.calories)
    setValue('protein', foodItem?.protein)
    setValue('fat', foodItem?.fat)
    setValue('carbohydrates', foodItem?.carbohydrates)
  }, [
    foodItem?.calories,
    foodItem?.carbohydrates,
    foodItem?.fat,
    foodItem?.foodItemName,
    foodItem?.foodItemUnit,
    foodItem?.protein,
    foodItem?.servingSize,
    setValue,
  ])

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
      name: 'Ounces',
      value: 'OUNCES',
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
      servingSize: parseFloat(data.servingSize),
      calories: parseFloat(data.calories),
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbohydrates: parseFloat(data.carbohydrates),
      foodItemId: foodItem?.foodItemId,
    }

    updateFoodItem(updatedFoodItem)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container justifyContent="center">
        {generateFormTextInput({
          name: 'foodItemName',
          control: control,
          label: 'Food Name',
          placeholder: 'Food Name',
        })}
        {generateSelectInput({
          name: 'foodItemUnit',
          values: foodItemUnitValues,
          defaultValue: '',
          label: 'Food Units',
          control: control,
          register: register,
        })}
        {generateFormTextInput({
          name: 'servingSize',
          control: control,
          type: 'number',
          label: 'Serving Size',
          placeholder: 'Serving Size',
        })}
        {generateFormTextInput({
          name: 'calories',
          control: control,
          type: 'number',
          label: 'Calories',
          placeholder: 'Calories',
        })}
        {generateFormTextInput({
          name: 'protein',
          control: control,
          type: 'number',
          label: 'Protein',
          placeholder: 'Protein',
        })}
        {generateFormTextInput({
          name: 'fat',
          control: control,
          type: 'number',
          label: 'Fat',
          placeholder: 'Fat',
        })}
        {generateFormTextInput({
          name: 'carbohydrates',
          control: control,
          type: 'number',
          label: 'Carbohydrates',
          placeholder: 'Carbohydrates',
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
  )
}
