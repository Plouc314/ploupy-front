// next
import { useRouter } from 'next/router'

// types
import { FC } from '../types'

// mui
import {
  AppBar,
  Button,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'

// firebase
import { signOut } from "firebase/auth";

// components
import Page from '../src/components/Page'

// utils
import { auth } from '../src/utils/Firebase'
import Scene from '../src/pixi/scene';
import Sio from '../src/comm/sio';
import User from '../src/comm/user';
import CommSystem from '../src/pixi/comm';


export interface PageHomeProps { }

const PageHome: FC<PageHomeProps> = (props) => {

  const router = useRouter();

  return (
    <Page
      withAuth
      title='Home'
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Ploupy
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              signOut(auth)
                .then(() => {
                  router.replace("/login")
                })
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Paper sx={{ margin: 2, padding: 2 }}>
        <Typography>
          {"This site is in so early development I don't know what it's going to look like. \n Come back someday, maybe."}
        </Typography>
        <Button
          onClick={() => {
            Sio.connect()
            console.dir(User)
          }}
        >
          test
        </Button>
        <Button
          onClick={() => {
            Scene.start()
            setTimeout(() => {
              CommSystem.sendJoinGame()
            }, 100)
          }}
        >
          play
        </Button>

      </Paper>
      <canvas id="PixiCanvas" />
    </Page>
  )
}

export default PageHome
