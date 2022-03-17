import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material'
import React from 'react'

interface Props {
  view: string | null
  setView: React.Dispatch<React.SetStateAction<string | null>>
}

export const FoodsViewToggle: React.FC<Props> = ({ view, setView }) => {
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    setView(newView)
  }

  return (
    <Grid
      container
      justifyContent="space-between"
      sx={[
        {
          width: '100%',
          height: '60px',
          backgroundColor: 'white',
          border: 'none',
          padding: '1rem 0 0 0',
          position: 'sticky',
          top: -1,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        },
      ]}
    >
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="foods view"
        sx={{
          width: '100%',
          // margin: '0 1rem 0 1rem',
        }}
      >
        <ToggleButton
          value="catalog"
          aria-label="food catalog"
          sx={{ width: '50%' }}
        >
          Food Catalog
        </ToggleButton>
        <ToggleButton
          value="myfoods"
          aria-label="my foods"
          sx={{ width: '50%' }}
        >
          My Foods
        </ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  )
}
