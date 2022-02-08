import {
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FitnessTrackFoodItem, FoodItemUnits } from '../../../model/Model'
import { UseApi } from '../../../pages/FoodsPage/UseApi'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'

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
  useApi: UseApi
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

export const EditFoodItemDialog: React.FC<Props> = ({
  open,
  foodItem,
  useApi,
  setEditFoodDialogOpen,
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
  const { matchesMD } = useMediaQueries()
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
    defaultValue,
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
          defaultValue={defaultValue}
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
    await useApi.updateFoodItem(updatedFoodItem)
    useApi.fetchFoodItems(foodItem.categoryId, foodItem.subCategoryId)
    reset()
    setEditFoodDialogOpen({
      open: false,
      foodItem: null,
    })
    console.log(updatedFoodItem)
  }
  return (
    <Dialog open={open} fullScreen={!matchesMD}>
      <Grid container>
        <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
          <CardContent>
            <Typography variant="h4" align="center">
              Edit Food Item
            </Typography>
          </CardContent>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Grid container justifyContent="center">
                {generateFormTextInput({
                  name: 'foodItemName',
                  control: control,
                  defaultValue: foodItem.foodItemName,
                  label: 'Food Name',
                  placeholder: 'Food Name',
                })}
                {generateSelectInput({
                  name: 'foodItemUnit',
                  values: foodItemUnitValues,
                  defaultValue: foodItem.foodItemUnit,
                  label: 'Food Units',
                  control: control,
                  register: register,
                })}
                {generateFormTextInput({
                  name: 'servingSize',
                  control: control,
                  defaultValue: foodItem.servingSize,
                  type: 'number',
                  label: 'Serving Size',
                  placeholder: 'Serving Size',
                })}
                {generateFormTextInput({
                  name: 'calories',
                  control: control,
                  defaultValue: foodItem.calories,
                  type: 'number',
                  label: 'Calories',
                  placeholder: 'Calories',
                })}
                {generateFormTextInput({
                  name: 'protein',
                  control: control,
                  defaultValue: foodItem.protein,
                  type: 'number',
                  label: 'Protein',
                  placeholder: 'Protein',
                })}
                {generateFormTextInput({
                  name: 'fat',
                  control: control,
                  defaultValue: foodItem.fat,
                  type: 'number',
                  label: 'Fat',
                  placeholder: 'Fat',
                })}
                {generateFormTextInput({
                  name: 'carbohydrates',
                  control: control,
                  defaultValue: foodItem.carbohydrates,
                  type: 'number',
                  label: 'Carbohydrates',
                  placeholder: 'Carbohydrates',
                })}
                {generateFormTextInput({
                  name: 'foodItemReference',
                  control: control,
                  defaultValue: foodItem.foodItemReference ?? '',
                  type: 'text',
                  label: 'Reference Link',
                  placeholder: 'Reference Link',
                })}

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
                <Grid item xs={12} container justifyContent="center">
                  <Button
                    onClick={() => handleCancel()}
                    sx={{ marginBottom: '1rem' }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Dialog>
  )
}
