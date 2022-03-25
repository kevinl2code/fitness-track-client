import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Chip, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { FoodBuilderIngredient } from '../../model/Model'

interface Props {
  ingredients: FoodBuilderIngredient[]
  setIngredients: React.Dispatch<React.SetStateAction<FoodBuilderIngredient[]>>
  setFoodSelectorOpen: (value: React.SetStateAction<boolean>) => void
}

export const IngredientsInput: React.FC<Props> = ({
  ingredients,
  setIngredients,
  setFoodSelectorOpen,
}) => {
  const hasIngredients = ingredients.length > 0

  const handleDelete = (ingredient: FoodBuilderIngredient) => {
    const updatedIngredients = ingredients.filter(({ ingredientId }) => {
      return ingredientId !== ingredient.ingredientId
    })
    setIngredients(updatedIngredients)
  }

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
          position: 'relative',
        }}
      >
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="flex-end"
          sx={[
            { height: '48px' },
            hasIngredients && {
              height: '26px',
              // top: 0,
              // fontSize: '14px',
              // color: 'rgba(0, 0, 0, 0.6)',
            },
          ]}
        >
          <Typography
            sx={[
              {
                opacity: 0.75,
                paddingBottom: '1px',
                position: 'absolute',
                height: '30px',
                bottom: 0,
                left: 0,
              },
              hasIngredients && {
                top: 0,
                fontSize: '14px',
                // color: 'rgba(0, 0, 0, 0.6)',
              },
            ]}
          >
            Ingredients
          </Typography>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => setFoodSelectorOpen(true)}
            sx={{
              position: 'absolute',
              bottom: '0',
              right: 0,
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
        {ingredients.map((ingredient, index) => (
          <Chip
            key={`${ingredient.name}-${index}`}
            label={
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {ingredient.name}
              </Typography>
            }
            onDelete={() => handleDelete(ingredient)}
            sx={[
              {
                width: '85%',
                maxWidth: '85%',
                marginBottom: '4px',
                justifyContent: 'space-between',
              },
            ]}
          />
        ))}
      </Grid>
    </Grid>
  )
}
