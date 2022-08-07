import { Grid, Button, Container } from '@mui/material'
import React from 'react'
import PersonIcon from '@mui/icons-material/Person'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import LiveHelpIcon from '@mui/icons-material/LiveHelp'
import SettingsIcon from '@mui/icons-material/Settings'
import ArticleIcon from '@mui/icons-material/Article'
import { Calculate } from '../../utilities/Calculate'
import { Convert } from '../../utilities/Convert'
import { QueryCache } from 'react-query'
import { ListSection } from '../../components/ListSection'
import { ListSectionDetails } from '../../components/ListSection/ListSection'
import { ROUTES } from '../../navigation'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'

interface Props {
  // setUser: (user: User | null) => Promise<void>
  handleLogout: () => void
}

const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
)

export const MorePage: React.FC<Props> = ({ handleLogout }) => {
  const { userData } = useStore((state) => state.userSlice)
  const navigate = useNavigate()
  const calculate = new Calculate()
  const convert = new Convert()
  const queryCache = new QueryCache()
  let usersAge

  if (userData) {
    usersAge = calculate.age(userData?.birthday!)
  }

  const userSection: ListSectionDetails[] = [
    {
      itemName: 'Profile',
      itemType: 'button',
      itemIcon: <PersonIcon />,
      itemAction: () => navigate(`../${ROUTES.profile}`),
    },
  ]

  const infoSection: ListSectionDetails[] = [
    {
      itemName: 'Frequently Asked Questions',
      itemType: 'button',
      itemIcon: <LiveHelpIcon />,
      itemAction: () => navigate(`../${ROUTES.faq}`),
    },
    {
      itemName: 'Glossary of Terms',
      itemType: 'button',
      itemIcon: <MenuBookIcon />,
      itemAction: () => null,
    },
  ]

  const applicationSection: ListSectionDetails[] = [
    {
      itemName: 'Settings',
      itemType: 'button',
      itemIcon: <SettingsIcon />,
      itemAction: () => navigate(`../${ROUTES.appSettings}`),
    },
    {
      itemName: 'Terms and Conditions',
      itemType: 'button',
      itemIcon: <ArticleIcon />,
      itemAction: () => navigate(`../${ROUTES.termsAndConditions}`),
    },
  ]

  return (
    <Container>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ paddingTop: '1rem', height: '100%' }}
      >
        <Grid item container>
          <ListSection sectionSubHeader="User" sectionItems={userSection} />
          <ListSection sectionSubHeader="Info" sectionItems={infoSection} />
          <ListSection
            sectionSubHeader="App"
            sectionItems={applicationSection}
          />
        </Grid>
        {/* <Divider sx={{ width: '100%', marginBottom: '1rem' }} /> */}
        <Grid item container sx={{ paddingTop: '20px' }}>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => handleLogout()}
            sx={{ width: '100%' }}
          >
            Sign Out
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}
