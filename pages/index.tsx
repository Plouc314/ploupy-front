// types
import { FC, ICore } from '../types'

// mui
import {
  Grid
} from '@mui/material'

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Lobby from '../src/components/Lobby'
import Doc from '../src/components/Doc';
import UsersList from '../src/components/UsersList';
import GamesList from '../src/components/GamesList';
import Footer from '../src/components/Footer';

export interface PageHomeProps { }

const PageHome: FC<PageHomeProps> = (props) => {

  return (
    <Page
      withAuth
      withComm
      title='Home'
    >
      <MenuBar />
      <Grid
        container
        spacing={1}
      >
        <Grid item xs={9}>
          <Doc />
          <Lobby />
        </Grid>
        <Grid item xs={3}>
          <UsersList />
          <GamesList />
        </Grid>
      </Grid>
      <Footer />

    </Page >
  )
}

export default PageHome
