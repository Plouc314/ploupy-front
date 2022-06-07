// next
import { useRouter } from 'next/router'

// react
import { useState } from 'react'

// types
import { FC, IModel } from '../types'

// mui
import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Lobby from '../src/components/Lobby'
import Textures from '../src/pixi/textures';
import { Box } from '@mui/system';

const docEntities = [
  {
    "primary": "Factory",
    "price": 100,
    "secondary": ["Build robots at regular interval"],
  },
  {
    "primary": "Turret",
    "price": 70,
    "secondary": [
      "Fire at one opponent robot at regular intervals",
      "(if any in range)",
    ],
  },
  {
    "primary": "Robot",
    "price": 10,
    "secondary": [
      "Factory built, move to nearby tiles to increase their occupation",
      "(makes the tile more colourful). Can be selected and receive",
      "manual orders",
    ],
  },
]

const docControls = [
  {
    "control": "F",
    "primary": "Toggle build factory",
    "secondary": ["Press F and click on a tile to build a factory"],
  },
  {
    "control": "T",
    "primary": "Toggle build turret",
    "secondary": ["Press T and click on a tile to build a turret"],
  },
  {
    "control": "X",
    "primary": "Explode selected robots",
    "secondary": ["Press X with selected robots will instantly explode them"],
  },
  {
    "control": "A",
    "primary": "Make selected robots attack",
    "secondary": [
      "Press A with selected robots will make them target the closest opponent",
      "territory and explode on arrival"
    ],
  },
  {
    "control": "S",
    "primary": "Select all",
    "secondary": ["Press S will select all robots"],
  },
]

export interface PageHomeProps { }

const PageHome: FC<PageHomeProps> = (props) => {

  const router = useRouter()

  const [shows, setShows] = useState({
    entities: false,
    controls: false,
  })

  return (
    <Page
      withAuth
      withComm
      title='Home'
    >
      <MenuBar />
      <Paper sx={{ margin: 2, padding: 2 }}>
        <Typography variant="h4" sx={{ color: "text.secondary" }}>
          <IconButton
            onClick={() => { setShows({ ...shows, entities: !shows.entities }) }}
          >
            {shows.entities ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
          Entities
        </Typography>
        <Collapse
          in={shows.entities}
        >
          {docEntities.map((doc, i) => (
            <Box
              key={`doc-entt-${i}`}
              sx={{ px: 2, py: 1 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {doc.primary}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ mr: 1 }}
                >
                  <Avatar
                    src={Textures.getIconURL("money")}
                    sx={{ width: 15, height: 15, pb: 0.5 }}
                  />
                  <Typography sx={{ fontWeight: "600" }}>
                    {doc.price}
                  </Typography>
                </Stack>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                align="justify"
                sx={{ px: 1 }}
              >
                {doc.secondary.join(" ")}
              </Typography>
            </Box>
          ))
          }
        </Collapse>

        <Typography variant="h4" sx={{ color: "text.secondary" }}>
          <IconButton
            onClick={() => { setShows({ ...shows, controls: !shows.controls }) }}
          >
            {shows.controls ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
          Controls
        </Typography>
        <Collapse
          in={shows.controls}
        >
          <List>
            {docControls.map((doc, i) => (
              <ListItem key={`doc-ctrl-${i}`}>
                <Typography
                  sx={{ pr: 3, fontWeight: 900, flexGrow: 0 }}
                >
                  {doc.control}
                </Typography>
                <ListItemText
                  primary={doc.primary}
                  secondary={doc.secondary.join(" ")}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Paper>
      <Lobby />

    </Page >
  )
}

export default PageHome
