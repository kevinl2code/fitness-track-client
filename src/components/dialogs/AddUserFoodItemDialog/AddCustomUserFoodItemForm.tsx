import { Grid } from '@mui/material'
import React from 'react'
import { Control, FieldValues, UseFormRegister } from 'react-hook-form'
import { FormSelectInput } from '../../form/FormSelectInput'
import { FormSelectInputProps } from '../../form/FormSelectInput/FormSelectInput'
import {
  FormTextInput,
  FormTextInputProps,
} from '../../form/FormTextInput/FormTextInput'

interface Props {
  control: Control<FieldValues, object>
  register: UseFormRegister<FieldValues>
}

export const AddCustomUserFoodItemForm: React.FC<Props> = ({
  control,
  register,
}) => {
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

  return (
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
  )
}
