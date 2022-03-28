import {
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  Typography,
} from '@mui/material'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FoodSubCategory } from '../../../model/Model'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { v4 } from 'uuid'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { DataService } from '../../../services/DataService'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'

interface IFormInput {
  subCategoryName: string
}

interface Props {
  open: boolean
  dataService: DataService
  categoryId: string
  fetchSubCategoryList: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>
  setAddFoodSubCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddFoodSubCategoryDialog: React.FC<Props> = ({
  open,
  dataService,
  categoryId,
  fetchSubCategoryList,
  setAddFoodSubCategoryDialogOpen,
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()
  const handleCancel = () => {
    reset()
    setAddFoodSubCategoryDialogOpen(false)
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

  const { mutate: createFoodSubCategory, isLoading } = useMutation(
    (subCategory: FoodSubCategory) =>
      dataService.createFoodSubCategory(subCategory),
    {
      onSuccess: () => {
        fetchSubCategoryList()
      },
    }
  )

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
    createFoodSubCategory(newSubCategory)

    reset()
    setAddFoodSubCategoryDialogOpen(false)
  }
  return (
    <Dialog open={open} fullScreen={true}>
      <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
        <CardContent>
          <Typography variant="h4" align="center">
            Add Food Sub-Category
          </Typography>
        </CardContent>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid container justifyContent="center">
              {generateFormTextInput({
                name: 'subCategoryName',
                control: control,
                required: true,
                label: 'Sub-Category Name',
                placeholder: 'Sub-Category Name',
              })}
              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: '1rem', marginBottom: '1rem' }}
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
