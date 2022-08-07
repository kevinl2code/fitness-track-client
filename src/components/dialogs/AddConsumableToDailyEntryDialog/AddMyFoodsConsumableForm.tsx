import { yupResolver } from '@hookform/resolvers/yup'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReset,
} from 'react-hook-form'
import { UseMutateFunction } from 'react-query'
import * as yup from 'yup'
import { DailyEntry, EntryConsumable, UserFoodItem } from '../../../model/Model'
import { useStore } from '../../../store/useStore'
import { FormTextInput } from '../../form/FormTextInput'
import { FormTextInputProps } from '../../form/FormTextInput/FormTextInput'
import { FormattedTextField } from '../../FormattedTextField/FormattedTextField'

interface Props {
  entry: DailyEntry
  updateDailyEntry: UseMutateFunction<DailyEntry, unknown, DailyEntry, unknown>
}

interface ListProps {
  foodItems: UserFoodItem[]
  selectedFoodItem: UserFoodItem | null
  filterText: string
  helperText?: string
  reset: UseFormReset<FieldValues>
  setFilterText: React.Dispatch<React.SetStateAction<string>>
  setSelectedFoodItem: React.Dispatch<React.SetStateAction<UserFoodItem | null>>
  setQuantity: (value: React.SetStateAction<string>) => void
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

export const AddMyFoodsConsumableForm: React.FC<Props> = ({
  entry,
  updateDailyEntry,
}) => {
  const { userFoodItems } = useStore((store) => store.userFoodItemsSlice)
  const [selectedFoodItem, setSelectedFoodItem] = useState<UserFoodItem | null>(
    null
  )
  const [filterText, setFilterText] = useState('')
  const [quantity, setQuantity] = useState('')
  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  useEffect(() => {
    return () => {
      setValue('name', '')
      setValue('calories', '')
      setValue('protein', '')
      setValue('fat', '')
      setValue('carbohydrates', '')
    }
  }, [setValue])

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

  const hasQuantity = quantity.length > 0

  let nameError
  if (errors) {
    if (errors.name) {
      nameError = errors.name.message
    }
  }

  return (
    <form key="addMyFoodsConsumableForm" onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent="center">
        <MyFoodsConsumablesList
          foodItems={userFoodItems}
          selectedFoodItem={selectedFoodItem}
          filterText={filterText}
          helperText={nameError}
          reset={reset}
          setFilterText={setFilterText}
          setSelectedFoodItem={setSelectedFoodItem}
          setQuantity={setQuantity}
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
              sx={{ paddingTop: '16px' }}
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

const MyFoodsConsumablesList: React.FC<ListProps> = ({
  foodItems,
  selectedFoodItem,
  filterText,
  helperText,
  reset,
  setFilterText,
  setSelectedFoodItem,
  setQuantity,
}) => {
  const filteredListItems = foodItems.filter((foodItem) => {
    return foodItem.foodItemName
      .toLowerCase()
      .includes(filterText.toLowerCase())
  })
  const generatedList = filteredListItems.map((foodItem, index) => {
    const { foodItemName } = foodItem
    return (
      <ListItem key={`${index}-${foodItemName}`} disableGutters>
        <ListItemButton onClick={() => setSelectedFoodItem(foodItem)}>
          <ListItemText primary={foodItemName} />
        </ListItemButton>
      </ListItem>
    )
  })
  return (
    <Grid container>
      {selectedFoodItem ? (
        <FormattedTextField
          label="Consumable"
          value={selectedFoodItem.foodItemName}
          helperText={helperText}
          onChange={(event) => setFilterText(event.target.value)}
          inputProps={{
            position: 'end',
            child: (
              <IconButton
                aria-label="remove-selected-consumable"
                onClick={() => {
                  setFilterText('')
                  reset()
                  setQuantity('')
                  setSelectedFoodItem(null)
                }}
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      ) : (
        <>
          <FormattedTextField
            label="Consumable"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            inputProps={{
              position: 'start',
              child: <SearchIcon />,
            }}
          />
          <Grid item xs={12}>
            <List>{generatedList}</List>
          </Grid>
        </>
      )}
    </Grid>
  )
}
