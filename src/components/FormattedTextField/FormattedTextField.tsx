import { Grid, TextField, InputAdornment, SxProps, Theme } from '@mui/material'
import React from 'react'

interface IFormattedTextField {
  label: string
  placeholder?: string
  value?: string | number | null
  onChange?:
    | React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined
  required?: boolean
  type?: 'text' | 'number'
  inputProps?: {
    position: 'start' | 'end'
    child: React.ReactNode | string
  }
  sx?: SxProps<Theme> | undefined
}

export const FormattedTextField: React.FC<IFormattedTextField> = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type,
  inputProps,
  sx,
}) => {
  return (
    <Grid
      container
      item
      xs={12}
      justifyContent="space-between"
      alignItems="center"
      sx={sx}
    >
      <Grid container justifyContent="flex-end" item>
        <TextField
          variant="standard"
          sx={{ width: '100%' }}
          required={required}
          type={type}
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          InputProps={
            inputProps && inputProps.position === 'start'
              ? {
                  startAdornment: (
                    <InputAdornment position={inputProps.position}>
                      {inputProps.child}
                    </InputAdornment>
                  ),
                }
              : inputProps && inputProps.position === 'end'
              ? {
                  endAdornment: (
                    <InputAdornment position={inputProps.position}>
                      {inputProps.child}
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        />
      </Grid>
    </Grid>
  )
}
