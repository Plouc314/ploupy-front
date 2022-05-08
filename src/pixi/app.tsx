// pixijs
import { Application } from 'pixi.js'

// pixi
import Textures from './textures'
import Frame from './frame'

class Pixi {
  static app: Application
  static ready = false
  static onLoadingComplete?: () => void

  static setup(canvas: HTMLCanvasElement) {
    if (this.ready) {
      return // only setup once
    }

    const size = Math.min(window.innerHeight, window.innerWidth) * 0.8

    this.app = new Application({
      view: canvas,
      width: size,
      height: size,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    })
    this.app.ticker.maxFPS = 30

    // load texture
    Textures.load(this.onLoadingComplete)

    this.app.ticker.add((dt) => {
      Frame.dt = dt
    })
  }
}

export default Pixi