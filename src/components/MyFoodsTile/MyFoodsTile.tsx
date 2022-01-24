import { Avatar, Button, Grid, Paper, Typography } from '@mui/material'
import React from 'react'

interface Props {
  label: string
  image: string
}

export const MyFoodsTile: React.FC<Props> = ({ label, image }) => {
  return (
    <Grid container item sx={{ height: '200px', width: '200px' }}>
      <Grid item xs={12} sx={{ height: '80%' }}>
        <Button
          sx={{
            height: '100%',
            width: '100%',
            borderRadius: '15px',
            padding: '2rem',
          }}
          variant="contained"
        >
          <img
            src={image}
            alt={label}
            style={{ height: '100%', width: '100%', objectFit: 'fill' }}
          />
        </Button>
      </Grid>
      <Grid
        sx={{ height: '20%' }}
        item
        xs={12}
        container
        justifyContent="center"
      >
        <Typography>{label}</Typography>
      </Grid>
    </Grid>
  )
}
