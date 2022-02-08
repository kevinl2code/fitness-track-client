import {
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  InputLabel,
  FormHelperText,
} from '@mui/material'
import React from 'react'
import {
  Control,
  Controller,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form'

export interface FormSelectInputProps {
  name: string
  values: {
    name: string
    value: string | number
  }[]
  control: Control<FieldValues, object>
  register: UseFormRegister<FieldValues>
  label: string
  placeholder?: string
  startAdornment?: React.ReactNode | string
  required?: boolean
  defaultValue?: string | number
  disabled?: boolean
}

export const FormSelectInput: React.FC<FormSelectInputProps> = ({
  name,
  values,
  control,
  register,
  label,
  placeholder,
  startAdornment,
  required = false,
  defaultValue,
  disabled = false,
}) => {
  const menuItems = values.map((value, index) => {
    return (
      <MenuItem value={value.value} key={`${index}-${value.value}`}>
        {value.name}
      </MenuItem>
    )
  })

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({
        field: { onChange, value },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <FormControl sx={{ width: '100%' }} error={error && true}>
          <InputLabel
            id={`${label}-select-label`}
            sx={{ left: '-13px', top: '7px' }}
          >
            {label}
          </InputLabel>
          <Select
            {...register}
            variant="standard"
            onChange={onChange}
            displayEmpty
            required={required}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <span style={{ opacity: 0.5 }}>{placeholder}</span>
              }

              return selected
            }}
            disabled={disabled}
            value={value}
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{ minWidth: '100%' }}
            startAdornment={
              startAdornment && (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              )
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {menuItems}
          </Select>
          {error && (
            <FormHelperText sx={{ marginLeft: '0px' }}>
              {error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
