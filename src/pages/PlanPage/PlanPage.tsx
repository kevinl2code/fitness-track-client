import { AccountCircle, Email } from '@mui/icons-material'
import {
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import React, { useContext } from 'react'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import WcIcon from '@mui/icons-material/Wc'
import PersonIcon from '@mui/icons-material/Person'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { CycleContext, UserContext, EntriesContext } from '../../app/App'

interface Props {}

export const PlanPage: React.FC<Props> = () => {
  const user = useContext(UserContext)
  const cycle = useContext(CycleContext)
  const calculate = new Calculate()
  const convert = new Convert()

  let usersAge

  if (user) {
    usersAge = calculate.age(user?.birthday!)
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ marginTop: '1rem' }}
    >
      <Grid item>
        <AccountCircle fontSize="large" />
      </Grid>
      <Grid item>
        <Typography variant="h6">{`${user?.firstName} ${user?.lastName}`}</Typography>
      </Grid>
      <Grid item>
        <Typography>{user?.user.userName}</Typography>
      </Grid>
      <Divider sx={{ width: '100%', marginTop: '1rem' }} />
      <Grid item sx={{ width: '100%' }}>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
          dense={true}
        >
          <ListItem sx={{ paddingLeft: '8px', paddingBottom: '0px' }}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Age" secondary={`${usersAge} yrs`} />
          </ListItem>
          <ListItem sx={{ paddingLeft: '8px', paddingBottom: '0px' }}>
            <ListItemAvatar>
              <Avatar>
                <WcIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Sex" secondary={user?.sex} />
          </ListItem>
          <ListItem sx={{ paddingLeft: '8px', paddingBottom: '0px' }}>
            <ListItemAvatar>
              <Avatar>
                <AlignHorizontalLeftIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Height"
              secondary={
                user?.height
                  ? `${convert.inchesToFeetAndInches(
                      user.height,
                      'ABBREVIATED'
                    )}`
                  : '-'
              }
            />
          </ListItem>
          <ListItem sx={{ paddingLeft: '8px', paddingBottom: '0px' }}>
            <ListItemAvatar>
              <Avatar>
                <Email />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Email" secondary={`${user?.email}`} />
          </ListItem>
        </List>
      </Grid>
      <Divider sx={{ width: '100%', marginBottom: '1rem' }} />
    </Grid>
  )
}
