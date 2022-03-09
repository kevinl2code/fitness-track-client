import { Box } from '@mui/material'
import React from 'react'
import { FoodsCatalogView } from '../../components/FoodsCatalogView'
import { FoodsMyFoodsView } from '../../components/FoodsMyFoodsView'
import { FoodsViewToggle } from '../../components/FoodsViewToggle'

//https://www.ars.usda.gov/ARSUserFiles/80400530/pdf/1112/food_category_list.pdf

export const FoodsPage: React.FC = () => {
  const [view, setView] = React.useState<string | null>('catalog')

  return (
    <>
      <FoodsViewToggle view={view} setView={setView} />
      {view === 'catalog' && (
        <Box sx={{ width: '100%' }}>
          <FoodsCatalogView />
        </Box>
      )}
      {view === 'myfoods' && (
        <Box sx={{ width: '100%' }}>
          <FoodsMyFoodsView />
        </Box>
      )}
    </>
  )
}
