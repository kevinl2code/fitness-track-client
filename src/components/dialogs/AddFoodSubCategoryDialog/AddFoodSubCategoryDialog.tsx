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
import { FoodCategory, FoodSubCategory } from '../../../model/Model'
import { UseApi } from '../../../pages/FoodsPage/UseApi'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { TextInput } from '../../form/TextInput'
import { v4 } from 'uuid'

interface IFormInput {
  subCategoryName: string
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
  categoryId: string
  useApi: UseApi
  setSubCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>
  setAddFoodSubCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddFoodSubCategoryDialog: React.FC<Props> = ({
  open,
  categoryId,
  useApi,
  setSubCategoriesLoading,
  setAddFoodSubCategoryDialogOpen,
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
    setAddFoodSubCategoryDialogOpen(false)
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
    const subCategoryId = v4()

    const newSubCategory: FoodSubCategory = {
      PK: 'SUBCATEGORIES',
      SK: `S_${subCategoryId}`,
      GSI2PK: `C_${categoryId}`,
      GSI2SK: 'METADATA',
      type: 'SUBCATEGORY',
      name: data.subCategoryName.toUpperCase(),
      categoryId: categoryId,
      subCategoryId: subCategoryId,
    }
    await useApi.createFoodSubCategory(newSubCategory)
    setSubCategoriesLoading(true)
    useApi.fetchSubCategoryList(categoryId)
    reset()
    setAddFoodSubCategoryDialogOpen(false)
  }
  return (
    <Dialog open={open} fullScreen={!matchesMD}>
      <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center">
            Add Food Sub-Category
          </Typography>
        </CardContent>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid container justifyContent="center">
              {generateTextInput({
                name: 'subCategoryName',
                control: control,
                required: true,
                label: 'Sub-Category Name',
                placeholder: 'Sub-Category Name',
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
