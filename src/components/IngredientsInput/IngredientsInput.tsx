import {
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Paper,
  Chip,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ClearIcon from '@mui/icons-material/Clear'
import { borders } from '@mui/system'
import React from 'react'

interface Props {
  setFoodSelectorOpen: (value: React.SetStateAction<boolean>) => void
}

export const IngredientsInput: React.FC<Props> = ({ setFoodSelectorOpen }) => {
  return (
    <Grid
      item
      container
      sx={{
        paddingLeft: '2rem',
        paddingRight: '2rem',
        marginBottom: '1rem',
        // borderBottom: '1.5px solid rgba(0, 0, 0, 0.22)',
        maxWidth: '100%',
      }}
    >
      <Grid
        item
        container
        sx={{
          borderBottom: '1.5px solid rgba(0, 0, 0, 0.22)',
        }}
      >
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ height: '48px' }}
        >
          <Typography sx={{ opacity: 0.75, paddingBottom: '1px' }}>
            Ingredients
          </Typography>
          {/* <Button variant="outlined" onClick={() => setFoodSelectorOpen(true)}>
          Add Ingredient
        </Button> */}
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => setFoodSelectorOpen(true)}
          >
            {/* <AddIcon sx={{ color: 'white' }} fontSize="large" /> */}
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
        <Chip
          label={
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              dhdthdthtdjfzzzzzzzzzzzzzzvhjfghjgkhhjgkjhghjk
            </Typography>
          }
          onDelete={() => null}
          sx={[
            {
              width: '100%',
              maxWidth: '100%',
              marginBottom: '4px',
              justifyContent: 'space-between',
            },
          ]}
        />
      </Grid>
    </Grid>
  )
}
