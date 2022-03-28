import { Button, Grid } from '@mui/material'
import React from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { UseMutateFunction } from 'react-query'
import { DailyEntry, EntryConsumable } from '../../../model/Model'

interface Props {
  entry: DailyEntry
  updateDailyEntry: UseMutateFunction<DailyEntry, unknown, DailyEntry, unknown>
}

interface IFormInput {
  name: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
}

const validationSchema = yup.object({
  // foodItemName regex specifies string cannot start or end with space or special characters
  name: yup
    .string()
    .matches(/^[a-zA-Z0-9](.*[a-zA-Z0-9])?$/, 'Please enter a valid name')
    .min(3)
    .max(40)
    .required(),
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

export const AddCustomConsumableForm: React.FC<Props> = ({
  entry,
  updateDailyEntry,
}) => {
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { name, calories, protein, fat, carbohydrates } = data
    const newConsumable: EntryConsumable = {
      name: name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbohydrates: parseFloat(carbohydrates),
    }
    const updatedConsumables = [...entry.dailyEntryConsumables, newConsumable]
    const updatedEntry = { ...entry, dailyEntryConsumables: updatedConsumables }
    updateDailyEntry(updatedEntry)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent="center">
        {generateFormTextInput({
          name: 'name',
          control: control,
          defaultValue: '',
          label: 'Consumable Name',
          placeholder: 'Consumable Name',
        })}
        {generateFormTextInput({
          name: 'calories',
          control: control,
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
          type: 'number',
          label: 'Carbohydrates',
          placeholder: 'Carbohydrates',
          inputProps: {
            position: 'end',
            child: 'grams',
          },
        })}
      </Grid>
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          type="submit"
          sx={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          Submit
        </Button>
      </Grid>
    </form>
  )
}
