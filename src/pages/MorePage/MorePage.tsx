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
  Button,
} from '@mui/material'
import React, { useContext } from 'react'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import WcIcon from '@mui/icons-material/Wc'
import PersonIcon from '@mui/icons-material/Person'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { UserContext } from '../../app/App'
import { QueryCache } from 'react-query'
import { User } from '../../model/Model'

interface Props {
  setUser: (user: User | null) => Promise<void>
  handleLogout: () => void
}

export const MorePage: React.FC<Props> = ({ setUser, handleLogout }) => {
  const user = useContext(UserContext)
  const calculate = new Calculate()
  const convert = new Convert()
  const queryCache = new QueryCache()
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
      <Button
        variant="outlined"
        size="medium"
        onClick={() => handleLogout()}
        sx={{ marginBottom: '8px' }}
      >
        Sign Out
      </Button>
    </Grid>
  )
}
