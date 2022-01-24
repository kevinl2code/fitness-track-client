import { Grid } from '@mui/material'
import React from 'react'
// import meatImage from '../../../public/meat.jpg'
import { MyFoodsTile } from '../../components/MyFoodsTile'

//https://www.ars.usda.gov/ARSUserFiles/80400530/pdf/1112/food_category_list.pdf

export const MyFoodsPage: React.FC = () => {
  const meatImage = `${process.env.PUBLIC_URL}/meat.png`
  const fruitImage = `${process.env.PUBLIC_URL}/fruit.png`
  const vegetablesImage = `${process.env.PUBLIC_URL}/vegetables.png`
  const dairyImage = `${process.env.PUBLIC_URL}/dairy.png`
  const grainsImage = `${process.env.PUBLIC_URL}/grains.png`
  const junkFoodImage = `${process.env.PUBLIC_URL}/junkfood.png`
  const alcoholImage = `${process.env.PUBLIC_URL}/alcohol.png`
  //https://www.flaticon.com/search?word=alcohol&order_by=4&type=icon

  const tiles = [
    {
      image: meatImage,
      label: 'Meat & Eggs',
    },
    {
      image: fruitImage,
      label: 'Fruit',
    },
    {
      image: vegetablesImage,
      label: 'Vegetables',
    },
    {
      image: dairyImage,
      label: 'Dairy',
    },
    {
      image: grainsImage,
      label: 'Bread, Pasta & Rice',
    },
    {
      image: junkFoodImage,
      label: 'Junk Food',
    },
    {
      image: alcoholImage,
      label: 'Alcohol',
    },
  ]
  const renderedTiles = tiles.map((tile) => {
    return <MyFoodsTile image={tile.image} label={tile.label} />
  })
  return (
    <Grid container columns={{ xs: 3, sm: 4, md: 6 }} spacing={2}>
      {renderedTiles}
    </Grid>
  )
}
