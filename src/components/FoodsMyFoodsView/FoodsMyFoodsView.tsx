import { Box, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FitnessTrackFoodItem, UserFoodItem } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { AddUserFoodItemDialog } from '../dialogs/AddUserFoodItemDialog'
import { FoodsTable } from '../FoodsTable'
import { UserContext } from '../../app/App'
import { useMutation, useQuery } from 'react-query'
import { ConfirmationDialog } from '../dialogs/ConfirmationDialog'

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

  const { mutate: deleteUserFoodItem, isLoading } = useMutation(
    ({ userId, foodItemId }: { userId: string; foodItemId: string }) =>
      dataService.deleteUserFoodItem(userId, foodItemId),
    {
      onSuccess: () => {
        fetchFoodItems()
        setConfirmationDialogOpen({
          open: false,
          deleteItem: null,
        })
      },
    }
  )

  const handleDelete = async () => {
    deleteUserFoodItem({
      userId: user?.sub!,
      foodItemId: confirmationDialogOpen.deleteItem?.id!,
    })
    fetchFoodItems()
  }

  return (
    <>
      <ConfirmationDialog
        open={confirmationDialogOpen.open}
        deleteItem={confirmationDialogOpen.deleteItem}
        handleConfirmation={handleDelete}
        setConfirmDeleteDialogOpen={setConfirmationDialogOpen}
      />
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
