import { FormControl, TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'

export interface FormTextInputProps {
  name: string
  control: Control<FieldValues, object>
  label?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  type?: 'text' | 'number'
  defaultValue?: string
  inputProps?: {
    [key: string]: any
  }
  disabled?: boolean
}

export type NewTextInputProps = Omit<TextFieldProps, 'defaultValue'> & {
  name: string
  control: Control<FieldValues, object>
  defaultValue?: string
}

export const FormTextInput: React.FC<NewTextInputProps> = (
  props: NewTextInputProps
) => {
  const { name, control, defaultValue, ...textFieldProps } = props

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({
        field,
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <FormControl sx={{ width: '100%' }}>
          <TextField
            {...textFieldProps}
            {...field}
            error={invalid}
            helperText={error?.message}
            sx={{ minWidth: '100%' }}
            variant="standard"
          />
        </FormControl>
      )}
    />
  )
}
