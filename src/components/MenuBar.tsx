// next
import { useRouter } from 'next/router'

// react
import { useState, useEffect, useRef, ReactNode } from 'react'

// types
import { FC, ICore } from '../../types'

// mui
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

// firebase
import {
  signOut
} from 'firebase/auth'

// utils
import { auth, useAuth } from '../utils/Firebase'

// pixi
import Textures from '../pixi/textures'


interface MenuOptionProps {
  title: string
  icon?: ReactNode
  onClick: () => void
}

const MenuOption: FC<MenuOptionProps> = (props) => {
  return (
    <MenuItem
      onClick={props.onClick}
    >
      <ListItemIcon>
        {props.icon}
      </ListItemIcon>
      <ListItemText>
        {props.title}
      </ListItemText>
    </MenuItem>
  )
}


export interface MenuBarProps {
  /** Use less margin - padding */
  compact?: boolean
  /** Only option will be to logout */
  restricted?: boolean
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
      <Toolbar
        variant={props.compact ? "dense" : "regular"}
      >
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <Typography variant={props.compact ? "h3" : "h1"}>
            Ploupy
          </Typography>
        </a>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Account">
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <Avatar
              alt="avatar"
              src={Textures.getAvatarURL(user.avatar)}
              sx={{
                width: props.compact ? 35 : 40,
                height: props.compact ? 35 : 40,
              }}
            />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={menuAnchor}
          open={!!menuAnchor}
          onClose={() => setMenuAnchor(null)}
        >
          {!props.restricted &&
            <MenuOption
              key="option-profile"
              title="Profile"
              icon={<PersonIcon />}
              onClick={() => { router.push("/profile") }}
            />
          }
          <MenuOption
            key="option-logout"
            title="Log out"
            icon={<LogoutIcon />}
            onClick={logout}
          />
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default MenuBar