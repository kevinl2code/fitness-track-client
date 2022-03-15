import { Box, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FitnessTrackFoodItem, UserFoodItem } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { AddUserFoodItemDialog } from '../dialogs/AddUserFoodItemDialog'
import { FoodsTable } from '../FoodsTable'
import { UserContext } from '../../app/App'
import { useQuery } from 'react-query'

// const demoFoodItems: UserFoodItem[] = [
//   {
//     PK: 'demmmmmoooooitemmmm',
//     SK: 'F_ngjkrfosdgrjoihdrs',
//     GSI2PK: 'U_demmmmmoooooitemmmm',
//     GSI2SK: 'FOODS',
//     type: 'FOOD',
//     foodItemName: 'Banananana',
//     foodItemUnit: 'EACH',
//     servingSize: 1,
//     calories: 90,
//     protein: 3,
//     fat: 1,
//     carbohydrates: 22,
//     foodItemId: 'ngjkrfosdgrjoihdrs',
//   },
//   {
//     PK: 'demmmmmoooooitemmmm',
//     SK: 'F_ngjkrfosdgrjoihdrs',
//     GSI2PK: 'U_demmmmmoooooitemmmm',
//     GSI2SK: 'FOODS',
//     type: 'FOOD',
//     foodItemName: 'Banananana',
//     foodItemUnit: 'EACH',
//     servingSize: 1,
//     calories: 90,
//     protein: 3,
//     fat: 1,
//     carbohydrates: 22,
//     foodItemId: 'ngjkrfosdgrjoihdrs',
//   },
//   {
//     PK: 'demmmmmoooooitemmmm',
//     SK: 'F_ngjkrfosdgrjoihdrs',
//     GSI2PK: 'U_demmmmmoooooitemmmm',
//     GSI2SK: 'FOODS',
//     type: 'FOOD',
//     foodItemName: 'Banananana',
//     foodItemUnit: 'EACH',
//     servingSize: 1,
//     calories: 90,
//     protein: 3,
//     fat: 1,
//     carbohydrates: 22,
//     foodItemId: 'ngjkrfosdgrjoihdrs',
//   },
// ]

const demoFoodItems: UserFoodItem[] = []

const isAdmin = true

export const FoodsMyFoodsView: React.FC = () => {
  const [foodItems, setFoodItems] = useState<UserFoodItem[]>([])
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
  const user = useContext(UserContext)
  const dataService = new DataService()

  dataService.setUser(user?.user!)

  const { isLoading: foodItemsLoading, refetch: fetchFoodItems } = useQuery(
    ['foodsUserFoodItems'],
    () => dataService.getUserFoodItems(user?.sub!),
    {
      onSuccess: (data) => {
        if (data && data.length > 0) {
          setFoodItems(data)
        }
      },
    }
  )

  return (
    <>
      <AddUserFoodItemDialog
        open={addFoodDialogOpen}
        user={user!}
        dataService={dataService}
        fetchFoodItems={fetchFoodItems}
        setAddFoodDialogOpen={setAddFoodDialogOpen}
      />
      <Box sx={[{ width: '100%', marginTop: '2rem' }]}>
        <Grid container spacing={matchesMD ? 1 : 0} sx={{ width: '100%' }}>
          <FoodsTable
            foodItems={foodItems}
            isAdmin={isAdmin}
            setAddFoodDialogOpen={setAddFoodDialogOpen}
            setEditFoodDialogOpen={setEditFoodDialogOpen}
            setConfirmDeleteDialogOpen={setConfirmationDialogOpen}
          />
        </Grid>
      </Box>
    </>
  )
}
