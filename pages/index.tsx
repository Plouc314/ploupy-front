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

// components
import Page from '../src/components/Page'
import MenuBar from '../src/components/MenuBar'
import Lobby from '../src/components/Lobby'
import Textures from '../src/pixi/textures';
import { Box } from '@mui/system';

const docEntities = [

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

  const [showDocCtrls, setShowDocCtrls] = useState(false)

  return (
    <Page
      withAuth
      title='Home'
    >
      <MenuBar />
      <Paper sx={{ margin: 2, padding: 2 }}>
        <Typography variant="h4" sx={{ color: "text.secondary" }}>
          <IconButton onClick={() => setShowDocCtrls(!showDocCtrls)}>
            <ArrowDropDownIcon />
          </IconButton>
          Entities
        </Typography>

        <Box sx={{ px: 2, py: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Factory
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
                {100}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            align="justify"
            sx={{ px: 1 }}
          >
            {docControls[3].secondary.join(" ") + docControls[3].secondary.join(" ") + docControls[3].secondary.join(" ") + docControls[3].secondary.join(" ") + docControls[3].secondary.join(" ") + docControls[3].secondary.join(" ")}
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ color: "text.secondary" }}>
          <IconButton onClick={() => setShowDocCtrls(!showDocCtrls)}>
            <ArrowDropDownIcon />
          </IconButton>
          Controls
        </Typography>
        <Collapse
          in={showDocCtrls}
        >
          <List>
            {docControls.map(doc => (
              <ListItem>
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
