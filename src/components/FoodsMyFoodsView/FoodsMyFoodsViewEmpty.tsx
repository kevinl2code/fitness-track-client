import { Button, Grid, Typography } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import React from 'react'
import { useMediaQueries } from '../../utilities/useMediaQueries'

interface Props {
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const onlineGroceries = `${process.env.PUBLIC_URL}/onlinegroceries.svg`

export const FoodsMyFoodsViewEmpty: React.FC<Props> = ({
  setAddFoodDialogOpen,
}) => {
  const { matchesMD } = useMediaQueries()

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={[{ height: '100%' }, !matchesMD && { marginTop: '2rem' }]}
    >
      <img
        src={onlineGroceries}
        alt="Charting Data"
        style={{ width: '80%', height: 'auto' }}
      />
      <Typography
        textAlign="center"
        variant="h6"
        sx={{
          width: '80%',
          color: 'primary.main',
          fontWeight: 700,
          marginTop: '2rem',
        }}
      >
        {`You dont have any custom food or drinks added.`}
      </Typography>
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        sx={{ marginTop: '1rem' }}
      >
        <Button
          color="primary"
          variant="contained"
          aria-label="add consumable"
          onClick={() => setAddFoodDialogOpen(true)}
          endIcon={<AddCircleIcon fontSize="large" />}
        >
          Add New
        </Button>
      </Grid>
    </Grid>
  )
}
