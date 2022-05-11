// pixijs
import { Loader, Texture } from 'pixi.js'

class Textures {
  public ready = false
  private loader = new Loader()

  private readonly avatars = [
    "bear",
    "dog",
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
    for (const avatar of this.avatars) {
      this.loader.add(avatar, `/assets/textures/${avatar}.png`)
    }
    // start loading
    this.loader.load()
  }

  public get(name: string): Texture {
    const texture = this.loader.resources[name].texture as Texture
    return texture
  }
}


export default Textures