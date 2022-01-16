import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import WcIcon from '@mui/icons-material/Wc'
import { Email } from '@mui/icons-material'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../../navigation'
import { AuthService } from '../../services/AuthService'
import { CognitoUser } from '@aws-amplify/auth'
import {
  Avatar,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material'
import { UserContext } from '../../app/App'
import { DateTime, Duration } from 'luxon'
import { Calculate } from '../../utilities/Calculate'

interface Props {
  setUser: React.Dispatch<React.SetStateAction<CognitoUser | null>>
}

export const MainAppBar: React.FC<Props> = ({ setUser }) => {
  const [auth, setAuth] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const calculate = new Calculate()
  const navigate = useNavigate()
  const authService = new AuthService()
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked)
  }
  const user = React.useContext(UserContext)
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogoutClick = (route: string) => {
    authService.logOut()
    setUser(null)
    navigate(route)
    handleClose()
  }

  // const today = DateTime.now()
  // const birthDay = DateTime.fromFormat(user?.birthday!, 'yyyy-MM-dd')
  // const thiiiii = Math.floor(today.diff(birthDay, ['years']).as('years'))
  // // const millisecondsSinceBirth = today - birthDay
  // // const usersAge = Duration.fromMillis(millisecondsSinceBirth).toFormat('y')
  // // console.log(usersAge)
  // console.log(thiiiii)
  const usersAge = calculate.age(user?.birthday!)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {/* TODO - ONLY SHOW ON MOBILE */}
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fitness Track
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Paper elevation={0}>
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
                      <Typography>{user?.userName}</Typography>
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
                        <ListItem
                          sx={{ paddingLeft: '8px', paddingBottom: '0px' }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Age"
                            secondary={`${usersAge} yrs`}
                          />
                        </ListItem>
                        <ListItem
                          sx={{ paddingLeft: '8px', paddingBottom: '0px' }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <WcIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Sex" secondary={user?.sex} />
                        </ListItem>
                        <ListItem
                          sx={{ paddingLeft: '8px', paddingBottom: '0px' }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <AlignHorizontalLeftIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Height"
                            secondary={`${user?.height} inches`}
                          />
                        </ListItem>
                        <ListItem
                          sx={{ paddingLeft: '8px', paddingBottom: '0px' }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <Email />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary="Email"
                            secondary={`${user?.email}`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
                {/* {/* <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem onClick={() => handleLogoutClick('/')}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  )
}
