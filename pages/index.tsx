// next
import { useRouter } from 'next/router'

// types
import { FC } from '../types'

// mui
import {
  AppBar,
  Button,
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
    </Page>
  )
}

export default PageHome
