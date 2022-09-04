// react
import { useRef } from 'react';

// types
import { FC, ICore } from '../types'

// mui
import {
  Avatar,
  Divider,
  Grid,
  Box,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material'

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Footer from '../src/components/Footer';

// pixi
import Textures from '../src/pixi/textures';
import { AVATARS, COLORS } from '../src/pixi/constants';


const getIconColor = () => {
  const idx = Math.floor(Math.random() * COLORS.length)
  return COLORS[idx]
}

export interface PageCreditsProps { }

const PageCredits: FC<PageCreditsProps> = (props) => {

  const FlatIconAttrs = useRef([
    {
      href: "https://www.flaticon.com/free-icons/laser",
      title: "laser icons",
      text: "Laser icons created by Freepik",
      icon: "turret",
      color: getIconColor(),
    },
    {
      href: "https://www.flaticon.com/free-icons/dollar-sign",
      title: "dollar sign icons",
      text: "Dollar sign icons created by Freepik",
      icon: "money",
      color: getIconColor(),
    },
    {
      href: "https://www.flaticon.com/free-icons/blank",
      title: "blank icons",
      text: "Blank icons created by Google",
      icon: "probe",
      color: getIconColor(),
    },
    {
      href: "https://www.flaticon.com/free-icons/gear",
      title: "gear icons",
      text: "Gear icons created by Freepik",
      icon: "factory",
      color: getIconColor(),
    },
    {
      href: "https://www.flaticon.com/free-icons/attack",
      title: "attack icons",
      text: "Attack icons created by Freepik",
      icon: "attack",
      color: getIconColor(),
    },
    {
      href: "https://www.flaticon.com/free-icons/explosion",
      title: "explosion icons",
      text: "Explosion icons created by PIXARTIST",
      icon: "explode",
      color: getIconColor(),
    },
  ])

  return (
    <Page
      title='Credits'
    >
      <MenuBar />
      <Box sx={{ p: 1 }} />
      <a
        href="https://www.flaticon.com"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography variant="h3" sx={{ pt: 3, pb: 1 }}>
          FlatIcon
        </Typography>
      </a>
      <Divider />
      <Grid container>
        {FlatIconAttrs.current.map(attr => (
          <Grid item sm={6} lg={4} key={attr.href}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ p: 1 }}
            >
              <Avatar
                variant="square"
                src={Textures.getIconURL(attr.icon, attr.color)}
                sx={{ width: 30, height: 30, pb: 0.5, pr: 1 }}
              />
              <a
                href={attr.href}
                title={attr.title}
                style={{ color: "inherit" }}
              >
                <Typography color="text.secondary">
                  {attr.text}
                </Typography>
              </a>
            </Stack>
          </Grid>
        ))}
      </Grid>
      <a
        href="https://kenney.nl/"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography variant="h3" sx={{ pt: 3, pb: 1 }}>
          Kenney
        </Typography>
      </a>
      <Divider />

      <a
        href="https://kenney.nl/assets/animal-pack-redux"
        style={{ color: "inherit" }}
      >
        <Typography sx={{ p: 2 }}>
          {"The amazing animals that you can't change !"}
        </Typography>
      </a>
      <Grid container>
        {AVATARS.map(avatar => (
          <Grid item key={avatar}>
            <Tooltip title={`a damn ${avatar}`}>
              <Avatar
                src={Textures.getAvatarURL(avatar)}
                sx={{ p: 0.5 }}
              />
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <Footer />
    </Page>

  )
}

export default PageCredits
