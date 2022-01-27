import { FormControl, TextField, InputAdornment } from '@mui/material'
import React from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'

interface Props {
  name: string
  control: Control<FieldValues, object>
  label: string
  placeholder: string
  required?: boolean
  type?: string
  defaultValue?: string
  inputProps?: {
    position: 'start' | 'end'
    icon: React.ReactNode
  }
}

export const TextInput: React.FC<Props> = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  type,
  defaultValue,
  inputProps,
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
            // helperText={invalid && 'Username is required'}
            sx={{ minWidth: '100%' }}
            label={label}
            placeholder={placeholder}
            required={required}
            type={type}
            variant="standard"
            InputProps={
              inputProps
                ? {
                    startAdornment: (
                      <InputAdornment position={inputProps.position}>
                        {inputProps.icon}
                      </InputAdornment>
                    ),
                  }
                : undefined
            }
          />
        </FormControl>
      )}
    />
  )
}
