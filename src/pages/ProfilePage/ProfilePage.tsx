import { Email } from '@mui/icons-material'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import CakeIcon from '@mui/icons-material/Cake'
import PersonIcon from '@mui/icons-material/Person'
import WcIcon from '@mui/icons-material/Wc'
import {
  Avatar,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIconProps,
  Typography,
} from '@mui/material'
import React from 'react'
import { MorePagesBackNavigation } from '../../components/MorePagesBackNavigation/MorePagesBackNavigation'
import { useStore } from '../../store/useStore'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'

interface ProfileListItemProps {
  subject: string
  value: string | undefined
  icon: React.ReactElement<SvgIconProps>
}

export const ProfilePage: React.FC = () => {
  const { userData } = useStore((state) => state.userSlice)
  const calculate = new Calculate()
  const convert = new Convert()
  let usersAge

  // if (userData) {
  //   usersAge = calculate.age(userData?.birthday!)
  // }

  return (
    <>
      <Grid container justifyContent="center">
        <MorePagesBackNavigation />
      </Grid>
      <Container>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h6">{`${userData?.firstName} ${userData?.lastName}`}</Typography>
          </Grid>
          {/* <Divider sx={{ width: '100%', marginTop: '1rem' }} /> */}

          <Grid item sx={{ width: '100%', maxWidth: 360 }}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
              }}
              dense={true}
            >
              <ProfileListItem
                subject="Username"
                value={userData?.user.userName}
                icon={<PersonIcon />}
              />
              <ProfileListItem
                subject="Birthday"
                value={`${userData?.birthday!}`}
                icon={<CakeIcon />}
              />
              <ProfileListItem
                subject="Sex"
                value={userData?.sex}
                icon={<WcIcon />}
              />
              <ProfileListItem
                subject="Height"
                value={
                  userData?.height
                    ? `${convert.inchesToFeetAndInches(
                        userData.height,
                        'ABBREVIATED'
                      )}`
                    : '-'
                }
                icon={<AlignHorizontalLeftIcon />}
              />
              <ProfileListItem
                subject="Email"
                value={userData?.email}
                icon={<Email />}
              />
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({
  subject,
  value,
  icon,
}) => {
  return (
    <ListItem sx={{ paddingLeft: '8px', paddingBottom: '0px' }}>
      <ListItemAvatar>
        <Avatar>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={subject} secondary={value} />
    </ListItem>
  )
}
