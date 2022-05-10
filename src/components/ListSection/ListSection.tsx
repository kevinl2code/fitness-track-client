import {
  Button,
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
  itemType: 'text' | 'textButton' | 'button'
  itemIcon?: ReactElement<any, any>
  secondaryText?: String
  itemAction?: () => void
}

interface Props {
  sectionSubHeader: string
  sectionItems: ListSectionDetails[]
  justify?: 'center' | 'flex-start'
  dense?: boolean
}

export const ListSection: React.FC<Props> = ({
  sectionSubHeader,
  sectionItems,
  justify,
  dense = false,
}) => {
  const listItems = sectionItems.map((item, index) => {
    const { itemName, secondaryText, itemType, itemIcon, itemAction } = item

    if (itemType === 'text') {
      return (
        <ListItem
          key={`${index}-${itemName}`}
          secondaryAction={<Typography>{secondaryText}</Typography>}
        >
          <ListItemText sx={{ marginLeft: '1rem' }} primary={itemName} />
        </ListItem>
      )
    }

    if (itemType === 'button') {
      return (
        <ListItemButton onClick={itemAction} key={`${index}-${itemName}`}>
          <ListItemIcon>{itemIcon}</ListItemIcon>
          <ListItemText primary={itemName} />
        </ListItemButton>
      )
    }

    if (itemType === 'textButton') {
      return (
        <ListItem
          key={`${index}-${itemName}`}
          secondaryAction={
            <Button
              size="small"
              sx={{ fontSize: '1rem', textTransform: 'none', padding: 0 }}
              onClick={itemAction}
            >
              {secondaryText}
            </Button>
          }
        >
          <ListItemText sx={{ marginLeft: '1rem' }} primary={itemName} />
        </ListItem>
      )
    }
    return null
  })

  return (
    <Grid item container justifyContent={justify}>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        dense={dense}
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
        {listItems}
      </List>
    </Grid>
  )
}
