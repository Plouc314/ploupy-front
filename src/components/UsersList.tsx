// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore } from '../../types'

// mui
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets';

// hooks
import { useComm } from '../hooks/useComm'
import useSingleEffect from '../hooks/useSingleEffect'

// utils
import { useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures'


export interface UsersListProps {

}

const UsersList: FC<UsersListProps> = (props) => {

  const router = useRouter()
  const comm = useComm()

  // ref of list of users -> cause of callback hell
  const refUsers = useRef<ICore.ManUser[]>([])
  const [users, setUsers] = useState<ICore.ManUser[]>([])

  const onUserManagerState = (data: IComm.UserManagerState) => {

    for (const user of data.users) {
      // check if user exists
      const idx = refUsers.current.findIndex(u => u.user.uid === user.user.uid)
      if (idx == -1) {
        // add it
        refUsers.current.push(user)
      } else {
        // update players in user
        refUsers.current[idx] = user
      }
      refUsers.current = refUsers.current.filter(u => u.connected)
    }

    setUsers([...refUsers.current])
  }

  useSingleEffect(() => {
    if (!comm) return

    comm.setOnUserManagerState((data) => onUserManagerState(data))

    comm.refreshUserManager()
  })

  const onViewUser = (user: ICore.User) => {
    router.push(`/user?id=${user.uid}`)
  }

  return (
    <Paper sx={{ m: 2 }}>
      <Typography sx={{ p: 1 }} fontWeight="bold">
        Online users
      </Typography>
      <List>
        {users.map(u => (
          <ListItem
            key={u.user.uid}
            secondaryAction={
              <Tooltip title="View user">
                <IconButton
                  onClick={() => onViewUser(u.user)}
                >
                  <PetsIcon />
                </IconButton>
              </Tooltip>
            }
            sx={{ pt: 0.5, pb: 0.5 }}
          >
            <ListItemAvatar>
              <Avatar
                src={Textures.getAvatarURL(u.user.avatar)}
                sx={{ width: 30, height: 30 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={u.user.username}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default UsersList