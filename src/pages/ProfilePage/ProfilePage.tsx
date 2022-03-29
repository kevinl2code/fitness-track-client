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
  Container,
  Card,
  CardContent,
  SvgIconTypeMap,
  SvgIconProps,
} from '@mui/material'
import React, { useContext } from 'react'
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft'
import WcIcon from '@mui/icons-material/Wc'
import PersonIcon from '@mui/icons-material/Person'
import CakeIcon from '@mui/icons-material/Cake'
import { UserContext } from '../../app/App'
import { Convert } from '../../utilities/Convert'
import { Calculate } from '../../utilities/Calculate'
import { MorePagesBackNavigation } from '../../components/MorePagesBackNavigation/MorePagesBackNavigation'
import { OverridableComponent } from '@mui/material/OverridableComponent'

interface ProfileListItemProps {
  subject: string
  value: string | undefined
  icon: React.ReactElement<SvgIconProps>
  /*   icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string
  } */
}

export const ProfilePage: React.FC = () => {
  const user = useContext(UserContext)
  const calculate = new Calculate()
  const convert = new Convert()
  let usersAge

  if (user) {
    usersAge = calculate.age(user?.birthday!)
  }
  return (
    <>
      <Grid container justifyContent="center">
        <MorePagesBackNavigation />
      </Grid>
      <Container>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h6">{`${user?.firstName} ${user?.lastName}`}</Typography>
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
                value={user?.user.userName}
                icon={<PersonIcon />}
              />
              <ProfileListItem
                subject="Birthday"
                value={`${user?.birthday!}`}
                icon={<CakeIcon />}
              />
              <ProfileListItem
                subject="Sex"
                value={user?.sex}
                icon={<WcIcon />}
              />
              <ProfileListItem
                subject="Height"
                value={
                  user?.height
                    ? `${convert.inchesToFeetAndInches(
                        user.height,
                        'ABBREVIATED'
                      )}`
                    : '-'
                }
                icon={<AlignHorizontalLeftIcon />}
              />
              <ProfileListItem
                subject="Email"
                value={user?.email}
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
// const UserDetail: React.FC<UserDetailProps> = ({ subject, value }) => {
//   return (
//     <Card>
//       <CardContent>
//         <Grid item container>
//           <Grid item xs={6}>
//             <Typography textAlign="left">{`${subject}:`}</Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography textAlign="right">{`${value}`}</Typography>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   )
// }
