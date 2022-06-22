// next
import { useRouter } from 'next/router';

// react
import { useEffect, useState } from 'react'

// types
import { FC, ICore } from '../types'

// mui
import {
  Avatar,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'

// hooks
import useSingleEffect from '../src/hooks/useSingleEffect'

// components
import Page from '../src/components/Page'
import ProfileStats from '../src/components/ProfileStats'
import MenuBar from '../src/components/MenuBar'
import Loading from '../src/components/Loading';
import API from '../src/comm/api';
import Textures from '../src/pixi/textures';
import ErrorMessage from '../src/components/ErrorMessage';



interface UserInfoBarProps {
  user: ICore.User
}

const UserInfoBar: FC<UserInfoBarProps> = (props) => {

  return (
    <Paper sx={{ m: 2 }}>
      <List>
        <ListItem
          divider
          secondaryAction={<Avatar
            src={Textures.getAvatarURL(props.user.avatar)}
          />}
          sx={{ pb: 2 }}
        >
          <Typography variant="h4">
            {props.user.username}
          </Typography>
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography color="text.secondary">
              No clue...
            </Typography>
          }
        >
          <ListItemText
            primary="Joined on"
          />
        </ListItem>
      </List>
    </Paper>
  )
}


export interface PageUserProps { }

const PageUser: FC<PageUserProps> = (props) => {

  const router = useRouter()
  const [user, setUser] = useState<ICore.User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return
    if (!router.query.id) {
      setLoading(false)
      return
    }
    API.getUserData({ uid: router.query.id as string })
      .then((data) => {
        if (data) {
          setUser(data)
        }
        setLoading(false)
      })
  }, [router.isReady])

  return (
    <Page
      withAuth
      withComm
      title='Profile'
    >
      {loading &&
        <Loading label="Fetching user..." />
      }
      {!loading && !user &&
        <ErrorMessage label="User not found." />
      }
      {!loading && user &&
        <>
          <MenuBar />
          <Grid
            container
            spacing={1}
          >
            <Grid
              item
              xs={3}
            >
              <UserInfoBar user={user} />
            </Grid>
            <Grid
              item
              xs={9}
            >
              <ProfileStats uid={user.uid} />
            </Grid>
          </Grid>
        </>
      }

    </Page >
  )
}

export default PageUser
