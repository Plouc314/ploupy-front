// types
import { FC, ICore } from '../types'

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Lobby from '../src/components/Lobby'
import Doc from '../src/components/Doc';
import { Grid } from '@mui/material';
import UsersList from '../src/components/UsersList';
import GamesList from '../src/components/GamesList';

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


    </Page >
  )
}

export default PageHome
