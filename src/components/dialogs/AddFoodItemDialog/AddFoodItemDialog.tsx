import {
  Button,
  Card,
  CardContent,
  Dialog,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { FitnessTrackFoodItem, FoodItemUnits } from '../../../model/Model'
import { UseApi } from '../../../pages/FoodsPage/UseApi'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { v4 } from 'uuid'
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
  categoryId: string
  subCategoryId: string
  foodItemId: string
}

interface GenerateSelectInputProps {
  name: string
  menuItemValues: { name: string; value: string | number }[]
  required: boolean
  control: Control<FieldValues, object>
  label?: string
}

interface Props {
  open: boolean
  categoryId: string
  subCategoryId: string
  useApi: UseApi
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddFoodItemDialog: React.FC<Props> = ({
  open,
  categoryId,
  subCategoryId,
  useApi,
  setAddFoodDialogOpen,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()
  const { matchesMD } = useMediaQueries()
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
    control,
    required,
    menuItemValues,
    label,
  }: GenerateSelectInputProps) => {
    const menuItems = menuItemValues.map((value, index) => {
      return (
        <MenuItem value={value.value} key={`${index}-${value.value}`}>
          {value.name}
        </MenuItem>
      )
    })
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
        <FormControl fullWidth variant="standard">
          <InputLabel id={`${name}-input-label`}>{label}</InputLabel>
          <Controller
            name={name}
            control={control}
            defaultValue={''}
            render={({ field: { onChange, value } }) => (
              <Select
                {...register}
                variant="standard"
                onChange={onChange}
                required={required}
                label={label}
                value={value}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ minWidth: '100%' }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {menuItems}
              </Select>
            )}
          />
        </FormControl>
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
      categoryId: categoryId,
      subCategoryId: subCategoryId,
      foodItemId: newFoodItemId,
    }
    await useApi.createFoodItem(newFoodItem)
    useApi.fetchFoodItems(categoryId, subCategoryId)
    reset()
    setAddFoodDialogOpen(false)
    console.log(newFoodItem)
  }
  return (
    <Dialog open={open} fullScreen={!matchesMD}>
      <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center">
            Create Food Item
          </Typography>
        </CardContent>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid container justifyContent="center">
              {generateFormTextInput({
                name: 'foodItemName',
                control: control,
                required: true,
                label: 'Food Name',
                placeholder: 'Food Name',
              })}
              {generateSelectInput({
                name: 'foodItemUnit',
                menuItemValues: foodItemUnitValues,
                required: true,
                label: 'Food Units',
                control: control,
              })}
              {generateFormTextInput({
                name: 'servingSize',
                control: control,
                required: true,
                type: 'number',
                label: 'Serving Size',
                placeholder: 'Serving Size',
              })}
              {generateFormTextInput({
                name: 'calories',
                control: control,
                required: true,
                type: 'number',
                label: 'Calories',
                placeholder: 'Calories',
              })}
              {generateFormTextInput({
                name: 'protein',
                control: control,
                required: true,
                type: 'number',
                label: 'Protein',
                placeholder: 'Protein',
              })}
              {generateFormTextInput({
                name: 'fat',
                control: control,
                required: true,
                type: 'number',
                label: 'Fat',
                placeholder: 'Fat',
              })}
              {generateFormTextInput({
                name: 'carbohydrates',
                control: control,
                required: true,
                type: 'number',
                label: 'Carbohydrates',
                placeholder: 'Carbohydrates',
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
    </Dialog>
  )
}
