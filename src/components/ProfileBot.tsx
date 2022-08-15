// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IComm, ICore } from '../../types'

// mui
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ClearIcon from '@mui/icons-material/Clear';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudIcon from '@mui/icons-material/Cloud';
import KeyIcon from '@mui/icons-material/Key';
import BarChartIcon from '@mui/icons-material/BarChart';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// firebase
import {
  signOut
} from 'firebase/auth'

// hooks
import { useSnackbar } from 'notistack';
import { useComm, useUsers } from '../hooks/useComm';

// utils
import { auth, useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures';
import API from '../comm/api';
import useSingleEffect from '../hooks/useSingleEffect';


interface BotRowProps {
  bot: ICore.User
  online: boolean
  onDisconnect: () => void
  onDelete: () => void
}

const BotRow: FC<BotRowProps> = (props) => {

  const router = useRouter()

  const [menuActions, setMenuActions] = useState<HTMLElement | null>(null)

  const stats = () => {
    router.push(`/user?id=${props.bot.uid}`)
  }

  return (
    <>
      <TableRow>
        <TableCell>
          {props.bot.username}
        </TableCell>
        <TableCell align="center">
          {!props.online &&
            <Tooltip title="offline">
              <CloudOffIcon color="disabled" />
            </Tooltip>
          }
          {props.online &&
            <Tooltip title="online">
              <CloudIcon color="info" />
            </Tooltip>
          }

        </TableCell>
        <TableCell align="center">
          <Tooltip title="Copy bot key">
            <IconButton>
              <KeyIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center">
          <Tooltip title="See bot statistics">
            <IconButton onClick={stats}>
              <BarChartIcon color="secondary" />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Actions">
            <IconButton
              onClick={(e) => {
                setMenuActions(e.currentTarget)
              }}
            >
              <MoreHorizIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <Menu
        anchorEl={menuActions}
        open={!!menuActions}
        onClose={() => setMenuActions(null)}
      >
        {props.online &&
          <MenuItem
            onClick={() => {
              setMenuActions(null)
              props.onDisconnect()
            }}
          >
            <ListItemIcon>
              <PowerSettingsNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Disconnect</ListItemText>
          </MenuItem>
        }
        <MenuItem
          onClick={() => {
            setMenuActions(null)
            props.onDelete()
          }}
        >
          <ListItemIcon>
            <ClearIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

interface BotCreationProps {
  user: ICore.User
}

const BotCreation: FC<BotCreationProps> = (props) => {

  const { enqueueSnackbar } = useSnackbar()
  const [username, setUsername] = useState("")
  const [botKey, setBotKey] = useState("")
  const [copyMsg, setCopyMsg] = useState("Copy")

  const createBot = async () => {
    const response = await API.createBot({
      creator_uid: props.user.uid,
      username: username
    })

    if (!response.success) {
      enqueueSnackbar(response.msg, { variant: "error" })
    } else {
      setBotKey(response.bot_jwt)
    }
  }

  const copyBotKey = () => {
    navigator.clipboard.writeText(botKey)
      .then(() => setCopyMsg("Copied."))
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ m: 2, mt: 4 }}
      >
        <Typography variant='h3'>
          New
        </Typography>

        <TextField
          size="small"
          required
          id="username"
          label="Username"
          name="username"
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
        />

        <Button
          variant="contained"
          onClick={createBot}
        >
          Create bot
        </Button>
      </Stack>
      {botKey &&
        <>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ m: 2, mt: 4 }}
          >
            <Typography variant="h4" sx={{ mr: 1 }}>
              Bot Key
            </Typography>
            <Tooltip
              title={copyMsg}
              onOpen={() => setCopyMsg("Click to copy")}
            >
              <IconButton onClick={copyBotKey}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant="subtitle2">
            {botKey}
          </Typography>
        </>
      }
    </>
  )
}

export interface ProfileBotProps {
  user: ICore.User
}

const ProfileBot: FC<ProfileBotProps> = (props) => {

  const comm = useComm()
  const users = useUsers()
  const { enqueueSnackbar } = useSnackbar()

  const [bots, setBots] = useState<ICore.User[]>([])

  useSingleEffect(async () => {
    for (const bot_uid of props.user.bots) {
      const bot = await API.getUserData({ uid: bot_uid })
      if (bot) {
        setBots([...bots, bot])
      }
    }
  })

  const onDisconnect = (bot: ICore.User) => {
    comm?.sendActionDisconnectBot({ bot_uid: bot.uid })
  }

  const onDelete = (bot: ICore.User) => {
    enqueueSnackbar("Not implemented.", { variant: "error" })
  }

  return (
    <>
      <Typography variant="h2" sx={{ m: 2, mt: 4 }}>
        Bot management
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ ml: 4, mr: 4 }}>
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell align="center">
                Status
              </TableCell>
              <TableCell align="center">
                Key
              </TableCell>
              <TableCell align="center">
                Stats
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {bots.map(bot => (
              <BotRow
                bot={bot}
                online={!!users.find(u => u.uid === bot.uid)}
                onDisconnect={() => onDisconnect(bot)}
                onDelete={() => onDelete(bot)}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider sx={{ mt: 4, mb: 2 }} />
      <Box sx={{ ml: 4, mr: 4 }}>
        <BotCreation user={props.user} />
      </Box>
    </>
  )
}

export default ProfileBot