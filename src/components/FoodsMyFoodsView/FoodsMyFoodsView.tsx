import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { FitnessTrackFoodItem, UserFoodItem } from '../../model/Model'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { FoodsTable } from '../FoodsTable'

const demoFoodItems: UserFoodItem[] = [
  {
    PK: 'demmmmmoooooitemmmm',
    SK: 'METADATA',
    type: 'FOOD',
    foodItemName: 'Banananana',
    foodItemUnit: 'EACH',
    servingSize: 1,
    calories: 90,
    protein: 3,
    fat: 1,
    carbohydrates: 22,
    foodItemId: 'F_ngjkrfosdgrjoihdrs',
  },
  {
    PK: 'demmmmmoooooitemmmm',
    SK: 'METADATA',
    type: 'FOOD',
    foodItemName: 'Banananana',
    foodItemUnit: 'EACH',
    servingSize: 1,
    calories: 90,
    protein: 3,
    fat: 1,
    carbohydrates: 22,
    foodItemId: 'F_ngjkrfosdgrjoihdrs',
  },
  {
    PK: 'demmmmmoooooitemmmm',
    SK: 'METADATA',
    type: 'FOOD',
    foodItemName: 'Banananana',
    foodItemUnit: 'EACH',
    servingSize: 1,
    calories: 90,
    protein: 3,
    fat: 1,
    carbohydrates: 22,
    foodItemId: 'F_ngjkrfosdgrjoihdrs',
  },
]

const isAdmin = true

export const FoodsMyFoodsView: React.FC = () => {
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  const [editFoodDialogOpen, setEditFoodDialogOpen] = useState<{
    open: boolean
    foodItem: FitnessTrackFoodItem | null
  }>({
    open: false,
    foodItem: null,
  })
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState<{
    open: boolean
    deleteItem: {
      name: string
      id: string
    } | null
  }>({
    open: false,
    deleteItem: null,
  })
  const { matchesMD } = useMediaQueries()

  return (
    <Box sx={[{ width: '100%', marginTop: '2rem' }]}>
      <Grid container spacing={matchesMD ? 1 : 0} sx={{ width: '100%' }}>
        <FoodsTable
          foodItems={demoFoodItems}
          isAdmin={isAdmin}
          setAddFoodDialogOpen={setAddFoodDialogOpen}
          setEditFoodDialogOpen={setEditFoodDialogOpen}
          setConfirmDeleteDialogOpen={setConfirmationDialogOpen}
        />
      </Grid>
    </Box>
  )
}
