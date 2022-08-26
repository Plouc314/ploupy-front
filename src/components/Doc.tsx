// next
import { useRouter } from 'next/router'

// react
import { useState } from 'react'

// types
import { FC, ICore, IGame } from '../../types'

// mui
import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  Box,
  ListItemText,
  Paper,
  Stack,
  Typography,
  ListItemSecondaryAction,
  ListItemIcon,
  capitalize,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// hooks
import useSingleEffect from '../hooks/useSingleEffect';

// components
import API from '../comm/api';
import Textures from '../pixi/textures';

export interface DocProps { }

const Doc: FC<DocProps> = (props) => {

  const [gc, setGc] = useState<ICore.GameConfig | null>(null)

  const [shows, setShows] = useState({
    entities: false,
    controls: false,
    techs: false,
  })

  useSingleEffect(() => {
    API.getGameMode("-N4SyXUFn-QCoXn9Uw3G")
      .then((mode) => {
        if (!mode) {
          throw new Error("No game config received.")
        }
        setGc(mode.config)
      })
  })

  const docEntities = [
    {
      primary: "Factory",
      price: gc?.factory_price ?? 0,
      secondary: ["Build robots at regular interval"],
    },
    {
      primary: "Turret",
      price: gc?.turret_price ?? 0,
      secondary: [
        "Fire at one opponent robot at regular intervals",
        "(if any in range)",
      ],
    },
    {
      primary: "Robot",
      price: gc?.probe_price ?? 0,
      secondary: [
        "Factory built, move to nearby tiles to increase their occupation",
        "(makes the tile more colourful). Can be selected and receive",
        "manual orders",
      ],
    },
  ]

  const docControls = [
    {
      control: "F",
      primary: "Toggle build factory",
      secondary: ["Press F and click on a tile to build a factory"],
    },
    {
      control: "T",
      primary: "Toggle build turret",
      secondary: ["Press T and click on a tile to build a turret"],
    },
    {
      control: "X",
      primary: "Explode selected robots",
      secondary: ["Press X with selected robots will instantly explode them"],
    },
    {
      control: "A",
      primary: "Make selected robots attack",
      secondary: [
        "Press A with selected robots will make them target the closest opponent",
        "territory and explode on arrival"
      ],
    },
    {
      control: "S",
      primary: "Select all",
      secondary: ["Press S will select all robots"],
    },
  ]

  const docTechs: {
    primary: string
    icon: IGame.TechIconName
    price: number
    type: IGame.TechType
    secondary: string[]
  }[] = [
      {
        primary: "US bombs",
        icon: "tech_probe_explosion_intensity",
        price: gc?.tech_probe_explosion_intensity_price ?? 0,
        type: "probe",
        secondary: [
          "Increase the probe's explosion intensity. Reduce the occupation",
          "of the affected tiles by a larger amount ",
          `(${gc?.probe_explosion_intensity} → `,
          `${(gc?.probe_explosion_intensity ?? 0) + (gc?.tech_probe_explosion_intensity_increase ?? 0)})`,
        ],
      },
      {
        primary: "EU tools",
        icon: "tech_probe_claim_intensity",
        price: gc?.tech_probe_claim_intensity_price ?? 0,
        type: "probe",
        secondary: [
          "Increase the probe's farming efficiency. Increase the occupation",
          "of the farmed tile by a larger amount ",
          `(${gc?.probe_claim_intensity} → `,
          `${(gc?.probe_claim_intensity ?? 0) + (gc?.tech_probe_claim_intensity_increase ?? 0)})`,
        ],
      },
      {
        primary: "Windows defender",
        icon: "tech_probe_hp",
        price: gc?.tech_probe_hp_price ?? 0,
        type: "probe",
        secondary: [
          "Increase the probe's resistance. Increase the amount of turret shots",
          "needed to take down the probe ",
          `(${gc?.probe_hp} → `,
          `${(gc?.probe_hp ?? 0) + (gc?.tech_probe_hp_increase ?? 0)})`,
        ],
      },
      {
        primary: "SpaceX-like factory",
        icon: "tech_factory_build_delay",
        price: gc?.tech_factory_build_delay_price ?? 0,
        type: "factory",
        secondary: [
          "Increase the factory speed. Reduce the time needed to build a probe ",
          `(${gc?.factory_build_probe_delay} → `,
          `${(gc?.factory_build_probe_delay ?? 0) - (gc?.tech_factory_build_delay_decrease ?? 0)}`,
          " sec)",
        ],
      },
      {
        primary: "Cloud deployment",
        icon: "tech_factory_max_probe",
        price: gc?.tech_factory_max_probe_price ?? 0,
        type: "factory",
        secondary: [
          "Scale up the factory. Increase the number of probes that a factory can handle ",
          `(${gc?.factory_max_probe} → `,
          `${(gc?.factory_max_probe ?? 0) + (gc?.tech_factory_max_probe_increase ?? 0)})`,
        ],
      },
      {
        primary: "Ford invocation",
        icon: "tech_factory_probe_price",
        price: gc?.tech_factory_probe_price_price ?? 0,
        type: "factory",
        secondary: [
          "Bring Henry Ford back from the dead to lead the factory.",
          "Reduce the cost of producing a probe",
          `(${gc?.probe_price} → `,
          `${(gc?.probe_price ?? 0) - (gc?.tech_factory_probe_price_decrease ?? 0)})`,
        ],
      }
    ]

  return (
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

      <Typography variant="h4" sx={{ color: "text.secondary" }}>
        <IconButton
          onClick={() => { setShows({ ...shows, techs: !shows.techs }) }}
        >
          {shows.controls ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
        Technologies
      </Typography>
      <Collapse
        in={shows.techs}
      >
        <List>
          {docTechs.map((doc, i) => (
            <ListItem
              key={`doc-entt-${i}`}
              sx={{ px: 2, py: 1 }}
            >
              <ListItemIcon>
                <Avatar
                  variant="square"
                  src={Textures.getIconURL(doc.icon)}
                  sx={{ width: 30, height: 30, pl: 1 }}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="h6">
                  {doc.primary}
                  <Typography
                    component="span"
                    variant="body1"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    {`(${capitalize(doc.type)})`}
                  </Typography>
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="justify"
                  sx={{ px: 1 }}
                >
                  {doc.secondary.join(" ")}
                </Typography>
              </ListItemText>
              <ListItemSecondaryAction>
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
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  )
}

export default Doc