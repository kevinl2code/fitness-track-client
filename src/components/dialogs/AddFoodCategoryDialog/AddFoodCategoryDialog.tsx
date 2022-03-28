import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FoodCategory } from '../../../model/Model'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { v4 } from 'uuid'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { DataService } from '../../../services/DataService'
import { useMutation, useQueryClient } from 'react-query'

interface IFormInput {
  categoryName: string
}

interface Props {
  open: boolean
  dataService: DataService
  setAddFoodCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddFoodCategoryDialog: React.FC<Props> = ({
  open,
  dataService,
  setAddFoodCategoryDialogOpen,
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()
  const queryClient = useQueryClient()
  const handleCancel = () => {
    reset()
    setAddFoodCategoryDialogOpen(false)
  }
  const generateFormTextInput = ({
    name,
    control,
    label,
    placeholder,
    required,
    type,
    inputProps,
  }: FormTextInputProps) => {
    return (
      <Grid
        item
        xs={12}
        container
        direction={'column'}
        sx={{
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingBottom: '1rem',
        }}
      >
        <FormTextInput
          control={control}
          label={label}
          required={required}
          type={type}
          name={name}
          placeholder={placeholder}
          inputProps={inputProps}
        />
      </Grid>
    )
  }

  const { mutate: createFoodCategory, isLoading } = useMutation(
    (category: FoodCategory) => dataService.createFoodCategory(category),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('categoryList')
      },
    }
  )

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const categoryId = v4()

    const newCategory: FoodCategory = {
      PK: 'CATEGORIES',
      SK: `C_${categoryId}`,
      type: 'CATEGORY',
      name: data.categoryName.toUpperCase(),
      categoryId: categoryId,
    }
    createFoodCategory(newCategory)
    reset()
    setAddFoodCategoryDialogOpen(false)
  }
  return (
    <Dialog open={open} fullScreen={true}>
      <DialogTitle>Add Food Category</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Grid container justifyContent="center">
            {generateFormTextInput({
              name: 'categoryName',
              control: control,
              required: true,
              label: 'Category Name',
              placeholder: 'Category Name',
            })}
            <Button
              variant="contained"
              type="submit"
              sx={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              Create
            </Button>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancel()} sx={{ marginBottom: '1rem' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
