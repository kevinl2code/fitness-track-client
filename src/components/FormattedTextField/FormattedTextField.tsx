import { Grid, TextField, InputAdornment, SxProps, Theme } from '@mui/material'
import React from 'react'

interface IFormattedTextField {
  label: string
  autoComplete?: 'on' | 'off'
  placeholder?: string
  value?: string | number | null
  helperText?: string
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
  autoComplete = 'on',
  placeholder,
  value,
  helperText,
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
          helperText={helperText}
          type={type}
          label={label}
          autoComplete={autoComplete}
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
