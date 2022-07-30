import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { useUserStore } from '../../../store/useUserStore'
import { FitnessTrackFoodItem, FoodItemUnits } from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'

interface IFormInput {
  PK: string
  SK: 'METADATA'
  GSI1PK: string
  GSI1SK: string
  type: 'FOOD'
  foodItemName: string
  foodItemUnit: FoodItemUnits
  servingSize: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
  foodItemReference: string
  categoryId: string
  subCategoryId: string
  foodItemId: string
}

interface Props {
  open: boolean
  foodItem: FitnessTrackFoodItem | null
  setEditFoodDialogOpen: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      foodItem: FitnessTrackFoodItem | null
    }>
  >
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
  foodItemReference: yup
    .string()
    .url('Enter a correct url')
    .required('Reference URL required'),
})

export const EditFitnessTrackFoodItemDialog: React.FC<Props> = ({
  open,
  foodItem,
  setEditFoodDialogOpen,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const { userData: user } = useUserStore()
  const dataService = new DataService()
  const queryClient = useQueryClient()

  dataService.setUser(user?.user!)
  useEffect(() => {
    setValue('foodItemName', foodItem?.foodItemName)
    setValue('foodItemUnit', foodItem?.foodItemUnit)
    setValue('servingSize', foodItem?.servingSize)
    setValue('calories', foodItem?.calories)
    setValue('protein', foodItem?.protein)
    setValue('fat', foodItem?.fat)
    setValue('carbohydrates', foodItem?.carbohydrates)
    setValue('foodItemReference', foodItem?.foodItemReference || '')
  }, [
    foodItem?.calories,
    foodItem?.carbohydrates,
    foodItem?.fat,
    foodItem?.foodItemName,
    foodItem?.foodItemReference,
    foodItem?.foodItemUnit,
    foodItem?.protein,
    foodItem?.servingSize,
    setValue,
  ])

  const { mutate: updateFoodItem, isLoading } = useMutation(
    (updatedFoodItem: FitnessTrackFoodItem) =>
      dataService.updateFoodItem(updatedFoodItem),
    {
      onSuccess: () => {
        // fetchFoodItems()
        queryClient.invalidateQueries('foodsFoodItems')
        setEditFoodDialogOpen({
          open: false,
          foodItem: null,
        })
      },
    }
  )

  const handleCancel = () => {
    reset()
    setEditFoodDialogOpen({
      open: false,
      foodItem: null,
    })
  }

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
          values={values}
        />
      </Grid>
    )
  }

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const updatedFoodItem: FitnessTrackFoodItem = {
      PK: foodItem.PK,
      SK: foodItem.SK,
      GSI1PK: foodItem.GSI1PK,
      GSI1SK: foodItem.GSI1SK,
      type: foodItem.type,
      foodItemName: data.foodItemName,
      foodItemUnit: data.foodItemUnit,
      servingSize: parseFloat(data.servingSize),
      calories: parseFloat(data.calories),
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbohydrates: parseFloat(data.carbohydrates),
      foodItemReference: data.foodItemReference,
      categoryId: foodItem.categoryId,
      subCategoryId: foodItem.subCategoryId,
      foodItemId: foodItem.foodItemId,
    }
    updateFoodItem(updatedFoodItem)
  }
  return (
    <Dialog open={open} fullScreen={true}>
      <DialogTitle>Edit Food Item</DialogTitle>
      <DialogContent>
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
            {generateFormTextInput({
              name: 'foodItemReference',
              control: control,
              type: 'text',
              label: 'Reference Link',
              placeholder: 'Reference Link',
            })}

            <Button
              variant="contained"
              type="submit"
              sx={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              Update
            </Button>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancel()} sx={{ marginBottom: '1rem' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
