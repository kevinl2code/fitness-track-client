import React, { useContext, useState } from 'react'
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
} from '../../../model/Model'
import { DataService } from '../../../services/DataService'
import { useForm } from 'react-hook-form'
import { ConsumablesList } from '../../ConsumablesList'
import { FoodsCategorySelect } from '../../FoodsCategorySelect'
import { FoodsSubCategorySelect } from '../../FoodsSubCategorySelect'
import { FormattedTextField } from '../../FormattedTextField/FormattedTextField'
import { useMediaQueries } from '../../../utilities/useMediaQueries'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FoodBuilderSelectorDialog: React.FC<Props> = ({
  open,
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
  const [quanity, setQuantity] = useState('')
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm()
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
      onSuccess: (data) => {
        setFoodItems(data)
      },
    }
  )

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

  const emptySubCategorySelected =
    selectedSubCategory && foodItems.length === 0 ? true : false

  const handleCloseDialog = () => {
    setSelectedCategory('')
    setSelectedSubCategory('')
    setFoodItems([])
    setFilterText('')
    setSelectedFoodItem(null)
    setQuantity('')
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} fullWidth PaperProps={{ sx: { height: '80%' } }}>
      <DialogContent>
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
              reset={reset}
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
                  margin: '0px 8px 1rem 8px',
                },
              ]}
            >
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
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}
