import { Box, Grid } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FitnessTrackFoodItem, UserFoodItem } from '../../model/Model'
import { DataService } from '../../services/DataService'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { AddUserFoodItemDialog } from '../dialogs/AddUserFoodItemDialog'
import { FoodsTable } from '../FoodsTable'
import { UserContext, UserFoodItemsContext } from '../../app/App'
import { useMutation, useQueryClient } from 'react-query'
import { ConfirmationDialog } from '../dialogs/ConfirmationDialog'
import { FoodsMyFoodsViewEmpty } from './FoodsMyFoodsViewEmpty'

const isAdmin = true

export const FoodsMyFoodsView: React.FC = () => {
  const foodItems = useContext(UserFoodItemsContext)
  // const [foodItems, setFoodItems] = useState<UserFoodItem[]>([])
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false)
  // const [editFoodDialogOpen, setEditFoodDialogOpen] = useState<{
  //   open: boolean
  //   foodItem: FitnessTrackFoodItem | null
  // }>({
  //   open: false,
  //   foodItem: null,
  // })
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
  const user = useContext(UserContext)
  const dataService = new DataService()
  const queryClient = useQueryClient()

  dataService.setUser(user?.user!)

  const { mutate: deleteUserFoodItem, isLoading } = useMutation(
    ({ userId, foodItemId }: { userId: string; foodItemId: string }) =>
      dataService.deleteUserFoodItem(userId, foodItemId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userFoodItems')
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
  }

  const noUserFoodsFound = foodItems.length === 0

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
        setAddFoodDialogOpen={setAddFoodDialogOpen}
      />
      <Box sx={[{ width: '100%', marginTop: '2rem' }]}>
        <Grid container spacing={0} sx={{ width: '100%' }}>
          {noUserFoodsFound ? (
            <FoodsMyFoodsViewEmpty
              setAddFoodDialogOpen={setAddFoodDialogOpen}
            />
          ) : (
            <FoodsTable
              foodItems={foodItems}
              isAdmin={isAdmin}
              setAddFoodDialogOpen={setAddFoodDialogOpen}
              // setEditFoodDialogOpen={setEditFoodDialogOpen}
              setConfirmDeleteDialogOpen={setConfirmationDialogOpen}
            />
          )}
        </Grid>
      </Box>
    </>
  )
}
