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
} from '@mui/material'

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Footer from '../src/components/Footer';
import Textures from '../src/pixi/textures';


export interface PageCreditsProps { }

const PageCredits: FC<PageCreditsProps> = (props) => {

  const FlatIconAttrs = [
    {
      href: "https://www.flaticon.com/free-icons/laser",
      title: "laser icons",
      text: "Laser icons created by Freepik",
      icon: "turret",
    },
    {
      href: "https://www.flaticon.com/free-icons/dollar-sign",
      title: "dollar sign icons",
      text: "Dollar sign icons created by Freepik",
      icon: "money",
    },
    {
      href: "https://www.flaticon.com/free-icons/adjustable-wrench",
      title: "adjustable wrench icons",
      text: "Adjustable wrench icons created by Freepik",
      icon: "probe",
    },
    {
      href: "https://www.flaticon.com/free-icons/gear",
      title: "gear icons",
      text: "Gear icons created by Freepik",
      icon: "factory",
    },
    {
      href: "https://www.flaticon.com/free-icons/attack",
      title: "attack icons",
      text: "Attack icons created by Freepik",
      icon: "attack",
    },
    {
      href: "https://www.flaticon.com/free-icons/explosion",
      title: "explosion icons",
      text: "Explosion icons created by PIXARTIST",
      icon: "explode",
    },
  ]

  return (
    <Page
      title='Profile'
    >
      <MenuBar noAvatar />
      <Box sx={{ p: 3 }} />
      <a
        href="https://www.flaticon.com"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography variant="h3" sx={{ pb: 1 }}>
          FlatIcon
        </Typography>
      </a>
      <Divider />
      <Grid container>
        {FlatIconAttrs.map(attr => (
          <Grid item xs={4}>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ p: 1 }}
            >
              <Avatar
                variant="square"
                src={Textures.getIconURL(attr.icon)}
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
      <Footer />
    </Page>

  )
}

export default PageCredits
