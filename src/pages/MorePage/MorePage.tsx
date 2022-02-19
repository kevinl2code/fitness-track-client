import { Grid, Divider, Button, Container } from '@mui/material'
import React, { useContext } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LiveHelpIcon from '@mui/icons-material/LiveHelp'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { UserContext } from '../../app/App'
import { QueryCache } from 'react-query'
import { User } from '../../model/Model'
import { ListSection } from '../../components/ListSection'
import { ListSectionDetails } from '../../components/ListSection/ListSection'
import { ROUTES } from '../../navigation'
import { useNavigate } from 'react-router-dom'

interface Props {
  setUser: (user: User | null) => Promise<void>
  handleLogout: () => void
}

export const MorePage: React.FC<Props> = ({ setUser, handleLogout }) => {
  const user = useContext(UserContext)
  const navigate = useNavigate()
  const calculate = new Calculate()
  const convert = new Convert()
  const queryCache = new QueryCache()
  let usersAge

  if (user) {
    usersAge = calculate.age(user?.birthday!)
  }

  const userSection: ListSectionDetails[] = [
    {
      itemName: 'Profile',
      itemIcon: <PersonIcon />,
      itemAction: () => navigate(`../${ROUTES.profile}`),
    },
  ]

  const infoSection: ListSectionDetails[] = [
    {
      itemName: 'Frequently Asked Questions',
      itemIcon: <LiveHelpIcon />,
      itemAction: () => null,
    },
    {
      itemName: 'Glossary of Terms',
      itemIcon: <MenuBookIcon />,
      itemAction: () => null,
    },
  ]

  return (
    <Container>
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ marginTop: '1rem' }}
      >
        <ListSection sectionSubHeader="User" sectionItems={userSection} />
        <ListSection sectionSubHeader="Info" sectionItems={infoSection} />
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
    </Container>
  )
}
