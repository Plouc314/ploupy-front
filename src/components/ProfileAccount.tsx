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
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';


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


/**
 * Make sure that the user is sure of what he thinks
 * he's sure of
 */
const useMakingSure = () => {

  const { user } = useAuth()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [step, setStep] = useState(0)

  const mk = (msgs: string[], delays?: number[]) => {

    const dls = delays ?? msgs.map(_ => 2000)
    setStep(step + 1)
    run(msgs, dls, 0)
  }

  const run = (msgs: string[], delays: number[], i: number) => {
    if (i == msgs.length) {
      msgs.forEach((v, i) => closeSnackbar(`mk-${step}-${i}`))
      return
    }
    enqueueSnackbar(msgs[i], { key: `mk-${step}-${i}` })
    setTimeout(() => {
      run(msgs, delays, i + 1)
    }, delays[i])
  }

  const story0 = [
    "Really ?",
    "Why would you do that ?",
    `Don't you love being a damn ${user.avatar} ?!`,
  ]
  const dls0 = [1500, 2000, 2500]

  const story1 = [
    "You don't seem to understand",
    `What will the ${user.avatar} think if you do that ?`,
    "It's extremely rude !",
  ]
  const dls1 = [1500, 2000, 2500]

  const story2 = [
    "You won't stop trying, will you ?",
    "You should try 7 times more",
    "We never know",
  ]
  const dls2 = [2000, 2000, 2500]

  const waitMsgs = [
    "Nope",
    "Still not",
    "Keep going",
    "Keep up",
    "Maybe...",
    "Maybe not...",
  ]

  const storyIncr = [
    waitMsgs[Math.floor(Math.random() * waitMsgs.length)]
  ]

  const story3 = [
    "You are really stubborn, aren't you?",
    "Come back in a month, maybe you'll be luckier...",
    `...the ${user.avatar} is pretty pissed off`,
  ]
  const dls3 = [2000, 2000, 3000]

  let makeSure: () => void = () => { }

  if (step == 0) {
    makeSure = () => mk(story0, dls0)
  }
  else if (step == 1) {
    makeSure = () => mk(story1, dls1)
  }
  else if (step == 2) {
    makeSure = () => mk(story2, dls2)
  }
  else if (step < 10) {
    makeSure = () => mk(storyIncr)
  }
  else if (step == 10) {
    makeSure = () => mk(story3, dls3)
  }

  return {
    makeSure,
    isReallySure: step > 10
  }
}

interface ProfileTableRowProps {
  /** If set, TableCell will have a flex display */
  flex?: boolean
  title: string
  onEdit?: () => void
  disabled?: boolean
}

const ProfileTableRow: FC<ProfileTableRowProps> = (props) => {
  return (
    <TableRow>
      <TableCell>
        <Typography variant="h6">
          {props.title}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        sx={{ display: props.flex ? "flex" : undefined }}
      >
        {props.children}
      </TableCell>
      <TableCell align="center">
        {props.onEdit &&
          <Tooltip title="Edit">
            <IconButton onClick={props.onEdit} disabled={props.disabled}>
              <EditIcon color={props.disabled ? "disabled" : "primary"} />
            </IconButton>
          </Tooltip>
        }
      </TableCell>
    </TableRow>
  )
}

export interface ProfileAccountProps { }

const ProfileAccount: FC<ProfileAccountProps> = (props) => {

  const router = useRouter()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const { makeSure, isReallySure } = useMakingSure()

  const logout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/login")
      })
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ m: 2, mt: 4 }}
      >
        <Typography variant="h2">
          {user.username}
        </Typography>
        <Tooltip title="Log out">
          <IconButton
            onClick={logout}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ ml: 4, mr: 4 }}>
        <Table>
          <TableBody>
            <ProfileTableRow
              title="Username"
              onEdit={() => {
                enqueueSnackbar("Not implemented.", { variant: "error" })
              }}
            >
              <Typography>
                {user.username}
              </Typography>
            </ProfileTableRow>
            <ProfileTableRow
              title="Email"
              onEdit={() => {
                enqueueSnackbar("Not implemented.", { variant: "error" })
              }}
            >
              <Typography>
                {user.email}
              </Typography>
            </ProfileTableRow>
            <ProfileTableRow
              flex
              title="Avatar"
              disabled={isReallySure}
              onEdit={() => { makeSure() }}
            >
              <Avatar
                src={Textures.getAvatarURL(user.avatar)}
                sx={{ alignSelf: "flex-end" }}
              />
            </ProfileTableRow>
            <ProfileTableRow
              title="Joined on"
            >
              <Typography>
                {new Date(user.joined_on).toLocaleDateString()}
              </Typography>
            </ProfileTableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  )
}

export default ProfileAccount