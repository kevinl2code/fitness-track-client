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
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/AuthService'
import { User } from '../../model/Model'

interface Props {
  setUser: (user: User | null) => Promise<void>
}

export const MorePage: React.FC<Props> = ({ setUser }) => {
  const user = useContext(UserContext)
  const navigate = useNavigate()
  const authService = new AuthService()
  const calculate = new Calculate()
  const convert = new Convert()

  let usersAge

  if (user) {
    usersAge = calculate.age(user?.birthday!)
  }

  const handleLogoutClick = (route: string) => {
    authService.logOut()
    setUser(null)
    navigate(route)
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
        onClick={() => handleLogoutClick('/')}
        sx={{ marginBottom: '8px' }}
      >
        Sign Out
      </Button>
    </Grid>
  )
}
