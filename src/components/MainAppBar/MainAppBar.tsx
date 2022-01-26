import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'

import { useNavigate } from 'react-router-dom'
import { AuthService } from '../../services/AuthService'
import { UserContext } from '../../app/App'

import { User } from '../../model/Model'

import { MainAppBarMenu } from './MainAppBarMenu'
import { Box, Grid } from '@mui/material'
import { MainAppBarTabs } from './MainAppBarTabs'
import { useMediaQueries } from '../../utilities/useMediaQueries'
import { MainAppBarMobileText } from './MainAppBarMobileText'

interface Props {
  setAppUser: (user: User | null) => Promise<void>
}

export const MainAppBar: React.FC<Props> = ({ setAppUser }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const navigate = useNavigate()
  const authService = new AuthService()
  const user = React.useContext(UserContext)
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const { matchesMD } = useMediaQueries()
  const handleLogoutClick = (route: string) => {
    authService.logOut()
    setAppUser(null)
    navigate(route)
    handleClose()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const ftlogo = `${process.env.PUBLIC_URL}/ftlogo2.png`
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        elevation={0}
      >
        <Toolbar variant="dense">
          {matchesMD && (
            <Grid
              container
              alignItems="flex-end"
              justifyContent="space-between"
              sx={{ height: '100%' }}
            >
              <img
                src={ftlogo}
                style={{
                  height: '58px',
                  objectFit: 'fill',
                  overflow: 'hidden',
                }}
                alt="Fitness Track logo"
              />
              <MainAppBarTabs isAdmin={user?.user.isAdmin!} />
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
              <MainAppBarMenu
                anchorEl={anchorEl}
                user={user}
                handleClose={handleClose}
                handleLogoutClick={handleLogoutClick}
              />
            </Grid>
          )}
          {!matchesMD && <MainAppBarMobileText />}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
