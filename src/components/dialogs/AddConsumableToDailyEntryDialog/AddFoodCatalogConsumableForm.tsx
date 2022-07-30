import { Button, Grid, SelectChangeEvent } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UseMutateFunction, useQuery } from 'react-query'
import { useUserStore } from '../../../store/useUserStore'
import {
  DailyEntry,
  EntryConsumable,
  FitnessTrackFoodItem,
  FoodCategory,
  FoodSubCategory,
} from '../../../model/Model'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { DataService } from '../../../services/DataService'
import { ConsumablesList } from '../../ConsumablesList'
import { FoodsCategorySelect } from '../../FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../../FoodsSubCategorySelect'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { FormattedTextField } from '../../FormattedTextField/FormattedTextField'

interface Props {
  entry: DailyEntry
  updateDailyEntry: UseMutateFunction<DailyEntry, unknown, DailyEntry, unknown>
}

interface IFormInput {
  name: string
  calories: string
  protein: string
  fat: string
  carbohydrates: string
}

const validationSchema = yup.object({
  // foodItemName regex specifies string cannot start with space or special characters
  name: yup
    .string()
    .matches(/^[a-zA-Z0-9](.*[a-zA-Z0-9])?$/, 'Please enter a valid name')
    .min(3)
    .max(150)
    .required(),
  calories: yup
    .number()
    .typeError('Calories required')
    .min(0, 'Must be at least 0')
    .max(10000, 'Must be 10000 or less')
    .required('Calories required'),
  protein: yup
    .number()
    .typeError('Protein required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Protein required'),
  fat: yup
    .number()
    .typeError('Fat required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Fat required'),
  carbohydrates: yup
    .number()
    .typeError('Carbohydrates required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Carbohydrates required'),
})

export const AddFoodCatalogConsumableForm: React.FC<Props> = ({
  entry,
  updateDailyEntry,
}) => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [selectedFoodItem, setSelectedFoodItem] =
    useState<FitnessTrackFoodItem | null>(null)
  const [filterText, setFilterText] = useState('')
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const { userData: user } = useUserStore()
  const dataService = new DataService()

  dataService.setUser(user?.user!)

  const { isLoading: categoriesLoading, data: fetchedCategories } = useQuery(
    'categoryList',
    () => dataService.getFoodCategories(),
    {
      onSuccess: (data) => setCategories(data),
    }
  )

  const { isLoading: subCategoriesLoading, data: fetchedSubCategories } =
    useQuery(
      ['entriesSubCategoryList', selectedCategory],
      () => dataService.getFoodSubCategories(selectedCategory),
      {
        enabled: !!selectedCategory,
        onSuccess: (data) => setSubCategories(data),
      }
    )

  const { isLoading: foodItemsLoading, data: fetchedFoodItems } = useQuery(
    ['entriesFoodItems', selectedCategory, selectedSubCategory],
    () => dataService.getFoodItems(selectedCategory, selectedSubCategory),
    {
      enabled: !!selectedSubCategory,
      onSuccess: (data) => {
        setFoodItems(data)
      },
    }
  )

  useEffect(() => {
    return () => {
      setValue('name', '')
      setValue('calories', '')
      setValue('protein', '')
      setValue('fat', '')
      setValue('carbohydrates', '')
    }
  }, [setValue])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
    setSelectedSubCategory('')
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset()
  }
  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value)
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset()
  }

  useEffect(() => {
    if (selectedFoodItem) {
      const valuePerUnit = {
        calories: selectedFoodItem.calories / selectedFoodItem.servingSize,
        protein: selectedFoodItem.protein / selectedFoodItem.servingSize,
        fat: selectedFoodItem.fat / selectedFoodItem.servingSize,
        carbohydrates:
          selectedFoodItem.carbohydrates / selectedFoodItem.servingSize,
      }
      const hasQuantity = quantity.length > 0
      const calories = hasQuantity
        ? (parseFloat(quantity) * valuePerUnit.calories)
            .toFixed(2)
            .replace(/[.,]00$/, '')
            .toString()
        : ''
      const protein = hasQuantity
        ? (parseFloat(quantity) * valuePerUnit.protein)
            .toFixed(2)
            .replace(/[.,]00$/, '')
            .toString()
        : ''
      const fat = hasQuantity
        ? (parseFloat(quantity) * valuePerUnit.fat)
            .toFixed(2)
            .replace(/[.,]00$/, '')
            .toString()
        : ''
      const carbohydrates = hasQuantity
        ? (parseFloat(quantity) * valuePerUnit.carbohydrates)
            .toFixed(2)
            .replace(/[.,]00$/, '')
            .toString()
        : ''
      setValue('name', selectedFoodItem?.foodItemName)
      setValue('calories', calories)
      setValue('protein', protein)
      setValue('fat', fat)
      setValue('carbohydrates', carbohydrates)
    }
  }, [quantity, selectedFoodItem, setValue])

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { name, calories, protein, fat, carbohydrates } = data
    const newConsumable: EntryConsumable = {
      name: name,
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      carbohydrates: parseFloat(carbohydrates),
    }
    const updatedConsumables = [...entry.dailyEntryConsumables, newConsumable]
    const updatedEntry = { ...entry, dailyEntryConsumables: updatedConsumables }
    updateDailyEntry(updatedEntry)
  }

  const generateFormTextInput = ({
    name,
    control,
    label,
    defaultValue,
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
          paddingTop: '1rem',
        }}
      >
        <FormTextInput
          control={control}
          label={label}
          required={required}
          defaultValue={defaultValue}
          disabled={true}
          type={type}
          name={name}
          inputProps={inputProps}
        />
      </Grid>
    )
  }

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  const hasQuantity = quantity.length > 0

  let nameError
  if (errors) {
    if (errors.name) {
      nameError = errors.name.message
    }
  }

  return (
    <form key="addFoodCatalogConsumableForm" onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent="center">
        <FoodsCategorySelect
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCategory={selectedCategory}
          setAddFoodCategoryDialogOpen={() => null}
          isAdmin={false}
          handleCategoryChange={handleCategoryChange}
        />
        <FoodsSubCategorySelect
          subCategories={subCategories}
          subCategoriesLoading={subCategoriesLoading}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          setAddFoodSubCategoryDialogOpen={() => null}
          handleSubCategoryChange={handleSubCategoryChange}
          isAdmin={false}
        />
        <ConsumablesList
          foodItems={foodItems}
          foodItemsLoading={foodItemsLoading}
          emptySubCategorySelected={emptySubCategorySelected}
          selectedSubCategory={selectedSubCategory}
          selectedFoodItem={selectedFoodItem}
          filterText={filterText}
          helperText={nameError}
          setFilterText={setFilterText}
          setQuantity={setQuantity}
          reset={reset}
          setSelectedFoodItem={setSelectedFoodItem}
        />
        {selectedFoodItem && (
          <>
            <FormattedTextField
              label="Quantity"
              autoComplete="off"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              inputProps={{
                position: 'end',
                child: selectedFoodItem?.foodItemUnit.toLowerCase(),
              }}
            />
            {generateFormTextInput({
              name: 'calories',
              control: control,
              label: 'Calories',
              placeholder: 'Calories',
              inputProps: {
                position: 'end',
                child: 'cals',
              },
            })}
            {generateFormTextInput({
              name: 'protein',
              control: control,
              label: 'Protein',
              placeholder: 'Protein',
              inputProps: {
                position: 'end',
                child: 'grams',
              },
            })}
            {generateFormTextInput({
              name: 'fat',
              control: control,
              type: 'number',
              label: 'Fat',
              placeholder: 'Fat',
              inputProps: {
                position: 'end',
                child: 'grams',
              },
            })}
            {generateFormTextInput({
              name: 'carbohydrates',
              control: control,
              label: 'Carbohydrates',
              placeholder: 'Carbohydrates',
              inputProps: {
                position: 'end',
                child: 'grams',
              },
            })}
          </>
        )}
      </Grid>
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          type="submit"
          disabled={!hasQuantity}
          sx={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          Submit
        </Button>
      </Grid>
    </form>
  )
}
