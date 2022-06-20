// types
import { ICore } from '../../types'


const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)

export type ModeNameOptions = {
  skipNPlayers?: boolean
}

/**
 * Get formatted name of the game mode
 */
export const getModeName = (mode: ICore.GameMode, options?: ModeNameOptions) => {

  let [name, nPlayer] = mode.name.split("-")

  if (name === "base") {
    name = "classic"
  }
  name = capitalize(name)

  if (!options || !options.skipNPlayers) {
    name += ` (${nPlayer} players)`
  }

  return name
}