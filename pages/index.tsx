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
import Page from '../components/Page'

// utils
import { auth } from '../utils/Firebase'


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
          This site is in so early development I don't what it's going to look like.
          Come back someday, maybe.
        </Typography>
      </Paper>
    </Page>
  )
}

export default PageHome
