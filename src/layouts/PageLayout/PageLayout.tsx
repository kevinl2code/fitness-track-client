import { Grid } from '@mui/material'

interface Props {
  children: NonNullable<React.ReactNode>
}

interface PageLayoutComposition {
  Header: React.FC<Props>
  Content: React.FC<Props>
}

export const PageLayout: React.FC<Props> & PageLayoutComposition = ({
  children,
}) => {
  return (
    <Grid container direction="column">
      {children}
    </Grid>
  )
}

const Header: React.FC<Props> = ({ children }) => {
  return <Grid item>{children}</Grid>
}

const Content: React.FC<Props> = ({ children }) => {
  return (
    <Grid item flex="1 1 0%">
      {children}
    </Grid>
  )
}

PageLayout.Header = Header
PageLayout.Content = Content
