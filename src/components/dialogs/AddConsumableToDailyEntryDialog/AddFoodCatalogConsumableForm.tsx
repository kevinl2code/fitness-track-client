import { Grid, SelectChangeEvent } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import {
  Control,
  FieldValues,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form'
import { UserContext } from '../../../app/App'
import {
  FitnessTrackFoodItem,
  FoodCategory,
  FoodSubCategory,
} from '../../../model/Model'
import { UseApi } from '../../../pages/FoodsPage/UseApi'
import { ConsumablesList } from '../../ConsumablesList'
import { FoodsCategorySelect } from '../../FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../../FoodsSubCategorySelect'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { FormattedTextField } from '../../FormattedTextField/FormattedTextField'

interface Props {
  control: Control<FieldValues, object>
  reset: UseFormReset<FieldValues>
  setValue: UseFormSetValue<FieldValues>
}

export const AddFoodCatalogConsumableForm: React.FC<Props> = ({
  control,
  reset,
  setValue,
}) => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(true)
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [foodItemsLoading, setFoodItemsLoading] = useState(true)
  const [selectedFoodItem, setSelectedFoodItem] =
    useState<FitnessTrackFoodItem | null>(null)
  const [filterText, setFilterText] = useState('')
  const [quanity, setQuantity] = useState('')

  const user = useContext(UserContext)
  const useApi = new UseApi(
    user?.user!,
    setCategories,
    setCategoriesLoading,
    setSubCategories,
    setSubCategoriesLoading,
    setFoodItems,
    setFoodItemsLoading
  )

  useEffect(() => {
    useApi.fetchCategoryList()
  }, [])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
    setSelectedSubCategory('')
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset()
    useApi.fetchSubCategoryList(event.target.value)
  }
  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value)
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset()
    useApi.fetchFoodItems(selectedCategory, event.target.value)
  }
  if (selectedFoodItem) {
    const valuePerUnit = {
      calories: selectedFoodItem.calories / selectedFoodItem.servingSize,
      protein: selectedFoodItem.protein / selectedFoodItem.servingSize,
      fat: selectedFoodItem.fat / selectedFoodItem.servingSize,
      carbohydrates:
        selectedFoodItem.carbohydrates / selectedFoodItem.servingSize,
    }
    const hasQuantity = quanity.length > 0
    const calories = hasQuantity
      ? (parseFloat(quanity) * valuePerUnit.calories)
          .toFixed(2)
          .replace(/[.,]00$/, '')
          .toString()
      : ''
    const protein = hasQuantity
      ? (parseFloat(quanity) * valuePerUnit.protein)
          .toFixed(2)
          .replace(/[.,]00$/, '')
          .toString()
      : ''
    const fat = hasQuantity
      ? (parseFloat(quanity) * valuePerUnit.fat)
          .toFixed(2)
          .replace(/[.,]00$/, '')
          .toString()
      : ''
    const carbohydrates = hasQuantity
      ? (parseFloat(quanity) * valuePerUnit.carbohydrates)
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

  return (
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
        setFilterText={setFilterText}
        setQuantity={setQuantity}
        reset={reset}
        setSelectedFoodItem={setSelectedFoodItem}
      />
      {selectedFoodItem && (
        <>
          <FormattedTextField
            label="Quantity"
            type="number"
            value={quanity}
            onChange={(event) => setQuantity(event.target.value)}
            inputProps={{
              position: 'end',
              child: selectedFoodItem?.foodItemUnit.toLowerCase(),
            }}
          />
          {generateFormTextInput({
            name: 'calories',
            control: control,
            required: true,
            type: 'number',
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
            required: true,
            type: 'number',
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
            required: true,
            defaultValue: 10,
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
            required: true,
            defaultValue: 0,
            type: 'number',
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
  )
}