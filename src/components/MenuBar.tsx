// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef } from 'react'

// types
import { FC, IModel } from '../../types'

// mui
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

// firebase
import {
  signOut
} from 'firebase/auth'

// utils
import { auth, useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures'

export interface MenuBarProps {

}

const MenuBar: FC<MenuBarProps> = (props) => {

  const router = useRouter()
  const { user } = useAuth()
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

  const logout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/login")
      })
    setMenuAnchor(null)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <Typography variant="h1">
            Ploupy
          </Typography>
        </a>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Account">
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <Avatar alt="avatar" src={Textures.getAvatarURL(user.avatar)} />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={menuAnchor}
          open={!!menuAnchor}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            onClick={logout}
          >
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default MenuBar