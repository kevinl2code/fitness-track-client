import { Grid } from '@mui/material'
import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'

interface Props {
  control: Control<FieldValues, object>
}

export const AddCustomConsumableForm: React.FC<Props> = ({ control }) => {
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

  return (
    <Grid container justifyContent="center">
      {generateFormTextInput({
        name: 'name',
        control: control,
        required: true,
        label: 'Consumable Name',
        placeholder: 'Consumable Name',
      })}
      {generateFormTextInput({
        name: 'calories',
        control: control,
        required: true,
        type: 'number',
        label: 'Calories',
        placeholder: 'Calories',
        inputProps: {
          position: 'end',
          child: 'cals',
        },
      })}
      {generateFormTextInput({
        name: 'protein',
        control: control,
        required: true,
        type: 'number',
        label: 'Protein',
        placeholder: 'Protein',
        inputProps: {
          position: 'end',
          child: 'grams',
        },
      })}
      {generateFormTextInput({
        name: 'fat',
        control: control,
        required: true,
        defaultValue: 0,
        type: 'number',
        label: 'Fat',
        placeholder: 'Fat',
        inputProps: {
          position: 'end',
          child: 'grams',
        },
      })}
      {generateFormTextInput({
        name: 'carbohydrates',
        control: control,
        required: true,
        defaultValue: 0,
        type: 'number',
        label: 'Carbohydrates',
        placeholder: 'Carbohydrates',
        inputProps: {
          position: 'end',
          child: 'grams',
        },
      })}
    </Grid>
  )
}
