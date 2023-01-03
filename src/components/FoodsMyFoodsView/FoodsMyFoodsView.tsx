import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { dataService } from '../../app/App'
import { AddUserFoodItemDialog } from '../dialogs/AddUserFoodItemDialog'
import { FoodsTable } from '../FoodsTable'
import { useMutation, useQueryClient } from 'react-query'
import { ConfirmationDialog } from '../dialogs/ConfirmationDialog'
import { FoodsMyFoodsViewEmpty } from './FoodsMyFoodsViewEmpty'
import { useStore } from '../../store/useStore'

const isAdmin = true

export const FoodsMyFoodsView: React.FC = () => {
  const { userFoodItems } = useStore((store) => store.userFoodItemsSlice)
  const { userData } = useStore((state) => state.userSlice)
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

  const queryClient = useQueryClient()

  // dataService.setUser(userData?.user!)

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
      userId: userData?.sub!,
      foodItemId: confirmationDialogOpen.deleteItem?.id!,
    })
  }

  const noUserFoodsFound = userFoodItems.length === 0

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
        user={userData!}
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
              foodItems={userFoodItems}
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
