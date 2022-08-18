// next
import { useRouter } from 'next/router'

// types
import { FC, ICore } from '../../types'

// mui
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets';
import MemoryIcon from '@mui/icons-material/Memory';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// pixi
import Textures from '../pixi/textures'
import { useUsers } from '../hooks/useComm';

export interface UserItemProps {
  user: ICore.User
  userType: "user" | "bot"
  onViewUser?: () => void
  onInviteUser?: () => void
}

export const UserItem: FC<UserItemProps> = (props) => {

  return (
    <ListItem
      key={props.user.uid}
      secondaryAction={
        <>
          {props.onInviteUser &&
            <Tooltip title={`Invite ${props.userType}`}>
              <IconButton
                onClick={props.onInviteUser}
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          }
          {props.onViewUser &&
            <Tooltip title={`View ${props.userType}`}>
              <IconButton
                onClick={props.onViewUser}
              >
                {props.userType == "bot" ?
                  <MemoryIcon /> : <PetsIcon />
                }
              </IconButton>
            </Tooltip>
          }
        </>
      }
      sx={{ pt: 0.5, pb: 0.5 }}
    >
      <ListItemAvatar>
        <Avatar
          src={Textures.getAvatarURL(props.user.avatar)}
          sx={{ width: 30, height: 30 }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={props.user.username}
      />
    </ListItem>
  )
}

export interface UsersListProps {

}

const UsersList: FC<UsersListProps> = (props) => {

  const router = useRouter()
  const users = useUsers()

  const onViewUser = (user: ICore.User) => {
    router.push(`/user?id=${user.uid}`)
  }

  return (
    <Paper sx={{ m: 2 }}>
      <Typography sx={{ p: 1 }} fontWeight="bold">
        Online users
      </Typography>
      <List>
        {users
          .filter(user => !user.is_bot)
          .map(user => (
            <UserItem
              key={user.uid}
              user={user}
              userType="user"
              onViewUser={() => onViewUser(user)}
            />
          ))}
      </List>
      <Typography sx={{ p: 1 }} fontWeight="bold">
        Online bots
      </Typography>
      <List>
        {users
          .filter(user => user.is_bot)
          .map(user => (
            <UserItem
              key={user.uid}
              user={user}
              userType="bot"
              onViewUser={() => onViewUser(user)}
            />
          ))}
      </List>
    </Paper>
  )
}

export default UsersList