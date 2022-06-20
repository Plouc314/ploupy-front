// react
import { useState } from 'react'

// types
import { FC, ICore } from '../types'

// mui
import {
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// utils
import { useAuth } from '../src/utils/Firebase';

// hooks
import useSingleEffect from '../src/hooks/useSingleEffect'

// components
import Page from '../src/components/Page'
import ProfileStats from '../src/components/ProfileStats'
import MenuBar from '../src/components/MenuBar'
import ProfileAccount from '../src/components/ProfileAccount';


type Tab = "stats" | "account"


interface ProfileSideBarProps {
  selected: Tab
  onChange: (value: Tab) => void
}

const ProfileSideBar: FC<ProfileSideBarProps> = (props) => {

  const values: Tab[] = [
    "stats",
    "account",
  ]
  const names = [
    "Statistics",
    "Account",
  ]
  const icons = [
    BarChartIcon,
    ManageAccountsIcon,
  ]

  return (
    <Paper sx={{ m: 2 }}>
      <List>
        {values.map((v, i) => {
          const Icon = icons[i]
          return (
            <ListItem key={v} disablePadding>
              <ListItemButton
                selected={props.selected === v}
                onClick={() => props.onChange(v)}
              >
                <ListItemIcon>
                  <Icon fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={names[i]}
                  primaryTypographyProps={{ variant: "h6" }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}


export interface PageProfileProps { }

const PageProfile: FC<PageProfileProps> = (props) => {

  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>("stats")

  return (
    <Page
      withAuth
      withComm
      title='Profile'
    >
      <MenuBar />
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          xs={3}
        >
          <ProfileSideBar
            selected={tab}
            onChange={(e) => setTab(e)}
          />
        </Grid>
        <Grid
          item
          xs={9}
        >
          <Collapse in={tab === "stats"}>
            <ProfileStats
              uid={user.uid}
            />
          </Collapse>
          <Collapse in={tab === "account"}>
            <ProfileAccount />
          </Collapse>
        </Grid>
      </Grid>
    </Page >
  )
}

export default PageProfile
