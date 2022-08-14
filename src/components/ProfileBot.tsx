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
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
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

// utils
import { auth, useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures';
import API from '../comm/api';

interface BotRowProps {
  bot: ICore.User
}

const BotRow: FC<BotRowProps> = (props) => {

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const stats = () => {
    router.push(`/user?id=${props.bot.uid}`)
  }

  return (
    <TableRow>
      <TableCell>
        {props.bot.username}
      </TableCell>
      <TableCell align="center">
        {false &&
          <Tooltip title="offline">
            <CloudOffIcon color="disabled" />
          </Tooltip>
        }
        {true &&
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
        <Tooltip title="Delete bot">
          <IconButton
            onClick={() => {
              enqueueSnackbar("Not implemented.", { variant: "error" })
            }}
          >
            <ClearIcon color={"error"} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
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

  const { enqueueSnackbar } = useSnackbar()

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
            <BotRow bot={props.user} />
            <BotRow bot={props.user} />
            <BotRow bot={props.user} />
            <BotRow bot={props.user} />
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