import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material'
import { String } from 'aws-sdk/clients/batch'
import React, { ReactElement } from 'react'

export type ListSectionDetails = {
  itemName: string
  itemIcon?: ReactElement<any, any>
  secondaryText?: String
  itemAction?: () => void
}

interface Props {
  sectionSubHeader: string
  sectionItems: ListSectionDetails[]
  justify?: 'center' | 'flex-start'
}

export const ListSection: React.FC<Props> = ({
  sectionSubHeader,
  sectionItems,
  justify,
}) => {
  const hasItemAction = sectionItems[0].itemAction !== undefined ? true : false

  const buttonListItems = sectionItems.map((item, index) => {
    const { itemName, itemIcon, itemAction } = item

    return (
      <ListItemButton onClick={itemAction} key={`${index}-${itemName}`}>
        <ListItemIcon>{itemIcon}</ListItemIcon>
        <ListItemText primary={itemName} />
      </ListItemButton>
    )
  })

  const dataListItems = sectionItems.map((item, index) => {
    const { itemName, secondaryText } = item

    return (
      <ListItem
        key={`${index}-${itemName}`}
        secondaryAction={<Typography>{secondaryText}</Typography>}
      >
        <ListItemText sx={{ marginLeft: '1rem' }} primary={itemName} />
      </ListItem>
    )
  })

  return (
    <Grid item container justifyContent={justify}>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{ fontWeight: 700 }}
          >
            {sectionSubHeader}
          </ListSubheader>
        }
      >
        {hasItemAction ? buttonListItems : dataListItems}
      </List>
    </Grid>
  )
}
