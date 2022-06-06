// pixijs
import { Loader, Texture } from 'pixi.js'

// pixi
import Color from '../utils/color'
import { AVATARS, ICONS, ICON_COLORS } from './constants'

class Textures {
  public ready = false
  private loader = new Loader()

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
    for (const avatar of AVATARS) {
      this.loader.add(avatar, `/assets/avatars/${avatar}.png`)
    }

    // icons
    for (const icon of ICONS) {
      // load for all colors
      for (const color of ICON_COLORS) {
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

  /**
   * Default color: black
   */
  public static getIconURL(name: string, color?: Color): string {
    if (!color) {
      color = Color.BLACK
    }
    return `assets/icons/${color.name()}/${name}.png`
  }

  public static getAvatarURL(name: string): string {
    return `assets/avatars/${name}.png`
  }
}


export default Textures