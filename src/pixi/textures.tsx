// pixijs
import { Loader, Texture } from 'pixi.js'

// pixi
import Color from '../utils/color'
import { COLORS } from './constants'

class Textures {
  public ready = false
  private loader = new Loader()

  private readonly avatars = [
    "bear",
    "dog",
  ]

  private readonly colors = [...COLORS, Color.WHITE]

  private readonly icons = [
    "factory",
    "probe",
    "money",
  ]

  public load(onClomplete?: () => void) {
    if (this.ready) {
      return
    }

    this.loader.onComplete.add(() => {
      this.ready = true
      if (onClomplete) {
        onClomplete()
      }
    })

    this.loader.reset()

    // avatars
    for (const avatar of this.avatars) {
      this.loader.add(avatar, `/assets/textures/${avatar}.png`)
    }

    // icons
    for (const icon of this.icons) {
      // load for all colors
      for (const color of this.colors) {
        const key = `${icon}-${color.name()}`
        this.loader.add(key, `/assets/icons/${color.name()}/${icon}.png`)
      }
    }

    // start loading
    this.loader.load()
  }

  public get(name: string): Texture {
    const texture = this.loader.resources[name].texture as Texture
    return texture
  }

  public getIcon(name: string, color: Color): Texture {
    const key = `${name}-${color.name()}`
    const texture = this.loader.resources[key].texture as Texture
    return texture
  }
}


export default Textures