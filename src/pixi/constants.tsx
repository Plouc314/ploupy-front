// types
import { IGame } from "../../types";

// utils
import Color from "../utils/color";

/**  Return the name of the png image that match the tech */
export const getTechIconName = (tech: IGame.Tech) => {
  return `tech_${tech.toLowerCase()}` as IGame.TechIconName
}

export const getTechType = (tech: IGame.Tech | IGame.TechIconName) => {
  const parts = tech.split("_")
  return tech.startsWith("tech") ?
    parts[1]
    : parts[0].toLowerCase() as IGame.TechType
}

export const COLORS = [
  Color.fromRgb(250, 100, 100),
  Color.fromRgb(100, 100, 250),
  Color.fromRgb(200, 200, 100),
  Color.fromRgb(100, 250, 100),
  Color.fromRgb(100, 200, 200),
  Color.fromRgb(200, 100, 200),
]

export const ICON_COLORS = [...COLORS, Color.WHITE, Color.BLACK]

export const TECHS: IGame.Tech[] = [
  "PROBE_EXPLOSION_INTENSITY",
  "PROBE_CLAIM_INTENSITY",
  "PROBE_HP",
  "FACTORY_BUILD_DELAY",
  "FACTORY_PROBE_PRICE",
  "FACTORY_MAX_PROBE",
  "TURRET_SCOPE",
  "TURRET_FIRE_DELAY",
  "TURRET_MAINTENANCE_COSTS",
]

export const AVATARS = [
  "snake",
  "dog",
  "gorilla",
  "moose",
  "penguin",
  "elephant",
  "chick",
  "sloth",
  "whale",
  "hippo",
  "parrot",
  "rabbit",
  "panda",
  "buffalo",
  "chicken",
  "owl",
  "crocodile",
  "zebra",
  "cow",
  "narwhal",
  "goat",
  "duck",
  "rhino",
  "monkey",
  "horse",
  "walrus",
  "pig",
  "frog",
  "bear",
  "giraffe",
]

export const ICONS = [
  "attack",
  "money",
  "factory",
  "turret",
  "explode",
  "probe",
  "tech",
].concat(
  TECHS.map(getTechIconName)
)

export const MAP_DIMS: Record<IGame.MapSize, IGame.Dimension> = {
  small: { x: 17, y: 17 },
  medium: { x: 21, y: 21 },
  large: { x: 25, y: 25 },
}