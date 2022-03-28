import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FitnessTrackFoodItem, FoodItemUnits } from '../../../model/Model'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { v4 } from 'uuid'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
  useMutation,
} from 'react-query'
import { DataService } from '../../../services/DataService'

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
  categoryId: string
  subCategoryId: string
  dataService: DataService
  fetchFoodItems: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const validationSchema = yup.object({
  // foodItemName regex specifies string cannot start with space or special characters
  foodItemName: yup
    .string()
    .matches(/^[a-zA-Z0-9](.*[a-zA-Z0-9])?$/, 'Please enter a valid name')
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
  foodItemReference: yup
    .string()
    .url('Enter a correct url')
    .required('Reference URL required'),
})

export const AddFoodItemDialog: React.FC<Props> = ({
  open,
  categoryId,
  subCategoryId,
  dataService,
  fetchFoodItems,
  setAddFoodDialogOpen,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  const { mutate: createFoodItem, isLoading } = useMutation(
    (newFoodItem: FitnessTrackFoodItem) =>
      dataService.createFoodItem(newFoodItem),
    {
      onSuccess: () => {
        fetchFoodItems()
        reset()
        setAddFoodDialogOpen(false)
      },
    }
  )

  const handleCancel = () => {
    reset()
    setAddFoodDialogOpen(false)
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
    const newFoodItemId = v4()

    const newFoodItem: FitnessTrackFoodItem = {
      PK: `F_${newFoodItemId}`,
      SK: 'METADATA',
      GSI1PK: `C_${categoryId}`,
      GSI1SK: `S_${subCategoryId}`,
      type: 'FOOD',
      foodItemName: data.foodItemName,
      foodItemUnit: data.foodItemUnit,
      servingSize: parseFloat(data.servingSize),
      calories: parseFloat(data.calories),
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbohydrates: parseFloat(data.carbohydrates),
      foodItemReference: data.foodItemReference,
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      foodItemId: newFoodItemId,
    }
    createFoodItem(newFoodItem)
  }
  return (
    <Dialog open={open} fullScreen={true}>
      <DialogTitle>Create Food Item</DialogTitle>
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
              Create
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
