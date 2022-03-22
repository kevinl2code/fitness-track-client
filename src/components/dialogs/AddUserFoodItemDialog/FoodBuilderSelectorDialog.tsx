import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  SelectChangeEvent,
} from '@mui/material'
import { useQuery } from 'react-query'
import { UserContext } from '../../../app/App'
import {
  FoodCategory,
  FoodSubCategory,
  FitnessTrackFoodItem,
  EntryConsumable,
  FoodBuilderIngredient,
} from '../../../model/Model'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { DataService } from '../../../services/DataService'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ConsumablesList } from '../../ConsumablesList'
import { FoodsCategorySelect } from '../../FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../../FoodsSubCategorySelect'
import { FormattedTextField } from '../../FormattedTextField/FormattedTextField'
import { useMediaQueries } from '../../../utilities/useMediaQueries'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'

interface Props {
  open: boolean
  ingredients: FoodBuilderIngredient[]
  setIngredients: React.Dispatch<React.SetStateAction<FoodBuilderIngredient[]>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFormInput {
  ingredientName: string
  ingredientCalories: string
  ingredientProtein: string
  ingredientFat: string
  ingredientCarbohydrates: string
}

const ingredientValidationSchema = yup.object({
  // foodItemName regex specifies string cannot start with space or special characters
  ingredientName: yup
    .string()
    .matches(/^[a-zA-Z0-9](.*[a-zA-Z0-9])?$/, 'Please enter a valid name')
    .min(3)
    .max(150)
    .required(),
  ingredientCalories: yup
    .number()
    .typeError('Calories required')
    .min(0, 'Must be at least 0')
    .max(10000, 'Must be 10000 or less')
    .required('Calories required'),
  ingredientProtein: yup
    .number()
    .typeError('Protein required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Protein required'),
  ingredientFat: yup
    .number()
    .typeError('Fat required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Fat required'),
  ingredientCarbohydrates: yup
    .number()
    .typeError('Carbohydrates required')
    .min(0, 'Must be at least 0')
    .max(1000, 'Must be 1000 or less')
    .required('Carbohydrates required'),
})

export const FoodBuilderSelectorDialog: React.FC<Props> = ({
  open,
  ingredients,
  setIngredients,
  setOpen,
}) => {
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subCategories, setSubCategories] = useState<FoodSubCategory[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  const [foodItems, setFoodItems] = useState<FitnessTrackFoodItem[]>([])
  const [selectedFoodItem, setSelectedFoodItem] =
    useState<FitnessTrackFoodItem | null>(null)
  const [filterText, setFilterText] = useState('')
  const [quantity, setQuantity] = useState('')
  // const useIngredientForm = useForm
  const {
    reset: reset2,
    handleSubmit: handleSubmit2,
    control: control2,
    setValue: setValue2,
    formState: { errors: errors2 },
  } = useForm({
    resolver: yupResolver(ingredientValidationSchema),
  })
  const { matchesMD } = useMediaQueries()
  const user = useContext(UserContext)

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
      onSuccess: (data: FitnessTrackFoodItem[]) => {
        const filteredFoodItems = data.filter((foodItem) => {
          return foodItem.foodItemUnit === 'GRAMS'
        })
        setFoodItems(filteredFoodItems)
      },
    }
  )

  useEffect(() => {
    return () => {
      setValue2('ingredientName', '')
      setValue2('ingredientCalories', '')
      setValue2('ingredientProtein', '')
      setValue2('ingredientFat', '')
      setValue2('ingredientCarbohydrates', '')
    }
  }, [setValue2])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
    setSelectedSubCategory('')
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset2()
  }
  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSelectedSubCategory(event.target.value)
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset2()
  }

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  const hasQuantity = quantity.length > 0

  let nameError
  if (errors2) {
    if (errors2.name) {
      nameError = errors2.name.message
    }
  }

  const handleCloseDialog = () => {
    setSelectedCategory('')
    setSelectedSubCategory('')
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset2()
    setOpen(false)
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
      setValue2('ingredientName', selectedFoodItem?.foodItemName)
      setValue2('ingredientCalories', calories)
      setValue2('ingredientProtein', protein)
      setValue2('ingredientFat', fat)
      setValue2('ingredientCarbohydrates', carbohydrates)
    }
  }, [setValue2, quantity, selectedFoodItem])

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const {
      ingredientName,
      ingredientCalories,
      ingredientProtein,
      ingredientFat,
      ingredientCarbohydrates,
    } = data
    const foodItemUnit = selectedFoodItem?.foodItemUnit!
    const foodItemId = selectedFoodItem?.foodItemId!
    const newIngredient: FoodBuilderIngredient = {
      name: ingredientName,
      foodItemId: foodItemId,
      foodItemUnit: foodItemUnit,
      quantity: parseFloat(quantity),
      calories: parseFloat(ingredientCalories),
      protein: parseFloat(ingredientProtein),
      fat: parseFloat(ingredientFat),
      carbohydrates: parseFloat(ingredientCarbohydrates),
    }
    const updatedIngredients = [...ingredients, newIngredient]
    setIngredients(updatedIngredients)
    handleCloseDialog()
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

  return (
    <Dialog open={open} fullWidth PaperProps={{ sx: { height: '80%' } }}>
      <DialogContent>
        <form
          key={2}
          id={'food-builder-ingredient-selector'}
          onSubmit={handleSubmit2(onSubmit)}
        >
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
            <Grid item md={2} xs={12}>
              <ConsumablesList
                foodItems={foodItems}
                foodItemsLoading={foodItemsLoading}
                emptySubCategorySelected={emptySubCategorySelected}
                selectedSubCategory={selectedSubCategory}
                selectedFoodItem={selectedFoodItem}
                filterText={filterText}
                setFilterText={setFilterText}
                setQuantity={setQuantity}
                reset={reset2}
                setSelectedFoodItem={setSelectedFoodItem}
              />
            </Grid>
            {selectedFoodItem && (
              <Grid
                item
                md={2}
                xs={12}
                sx={[
                  !matchesMD && {
                    margin: '0px 0px 1rem 0px',
                  },
                ]}
              >
                <FormattedTextField
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  inputProps={{
                    position: 'end',
                    child: selectedFoodItem?.foodItemUnit.toLowerCase(),
                  }}
                />
                {generateFormTextInput({
                  name: 'ingredientCalories',
                  control: control2,
                  label: 'Calories',
                  placeholder: 'Calories',
                  inputProps: {
                    position: 'end',
                    child: 'cals',
                  },
                })}
                {generateFormTextInput({
                  name: 'ingredientProtein',
                  control: control2,
                  label: 'Protein',
                  placeholder: 'Protein',
                  inputProps: {
                    position: 'end',
                    child: 'grams',
                  },
                })}
                {generateFormTextInput({
                  name: 'ingredientFat',
                  control: control2,
                  type: 'number',
                  label: 'Fat',
                  placeholder: 'Fat',
                  inputProps: {
                    position: 'end',
                    child: 'grams',
                  },
                })}
                {generateFormTextInput({
                  name: 'ingredientCarbohydrates',
                  control: control2,
                  label: 'Carbohydrates',
                  placeholder: 'Carbohydrates',
                  inputProps: {
                    position: 'end',
                    child: 'grams',
                  },
                })}
              </Grid>
            )}
          </Grid>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              type="submit"
              disabled={!hasQuantity}
              sx={[
                { marginTop: '1rem', marginBottom: '1rem' },
                matchesMD && { marginTop: 0 },
              ]}
            >
              Submit
            </Button>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
