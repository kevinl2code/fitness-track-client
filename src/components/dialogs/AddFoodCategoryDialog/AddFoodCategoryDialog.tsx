import {
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { Control, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FoodCategory, UserState } from '../../../model/Model'
import { UseApi } from '../../../pages/FoodsPage/UseApi'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { TextInput } from '../../form/TextInput'
import { v4 } from 'uuid'

interface IFormInput {
  categoryName: string
}

interface GenerateTextInputProps {
  name: string
  control: Control<FieldValues, object>
  label: string
  placeholder: string
  required: boolean
  type?: string
  inputProps?: {
    position: 'start' | 'end'
    icon: React.ReactNode
  }
}

interface Props {
  open: boolean
  useApi: UseApi
  setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>
  setAddFoodCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddFoodCategoryDialog: React.FC<Props> = ({
  open,
  useApi,
  setCategoriesLoading,
  setAddFoodCategoryDialogOpen,
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()
  const { matchesMD } = useMediaQueries()
  const handleCancel = () => {
    reset()
    setAddFoodCategoryDialogOpen(false)
  }
  const generateTextInput = ({
    name,
    control,
    label,
    placeholder,
    required,
    type,
    inputProps,
  }: GenerateTextInputProps) => {
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
        <TextInput
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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const categoryId = v4()

    const newCategory: FoodCategory = {
      PK: 'CATEGORIES',
      SK: `C_${categoryId}`,
      type: 'CATEGORY',
      name: data.categoryName.toUpperCase(),
      categoryId: categoryId,
    }
    await useApi.createFoodCategory(newCategory)
    setCategoriesLoading(true)
    useApi.fetchCategoryList()
    reset()
    setAddFoodCategoryDialogOpen(false)
  }
  return (
    <Dialog open={open} fullScreen={!matchesMD}>
      <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center">
            Add Food Category
          </Typography>
        </CardContent>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid container justifyContent="center">
              {generateTextInput({
                name: 'categoryName',
                control: control,
                required: true,
                label: 'Category Name',
                placeholder: 'Category Name',
              })}
              <Button
                variant="contained"
                type="submit"
                sx={[
                  { marginTop: '1rem', marginBottom: '1rem' },
                  matchesMD && { marginTop: 0 },
                ]}
              >
                Create
              </Button>
              <Grid item xs={12} container justifyContent="center">
                <Button
                  onClick={() => handleCancel()}
                  sx={{ marginBottom: '1rem' }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Dialog>
  )
}
