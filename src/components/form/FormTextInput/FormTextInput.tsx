import { FormControl, TextField } from '@mui/material'
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
  defaultValue?: string | number
  inputProps?: {
    [key: string]: any
  }
  disabled?: boolean
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  type,
  defaultValue,
  inputProps,
  disabled = false,
}) => {
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
            {...field}
            error={invalid}
            helperText={error?.message}
            sx={{ minWidth: '100%' }}
            label={label}
            placeholder={placeholder}
            required={required}
            type={type}
            variant="standard"
            disabled={disabled}
            InputProps={inputProps}
          />
        </FormControl>
      )}
    />
  )
}
