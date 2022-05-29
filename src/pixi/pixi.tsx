// pixijs
import { Application } from 'pixi.js'

// pixi
import Textures from './textures'


class Pixi {
  public app: Application
  public textures: Textures

  constructor(canvas: HTMLCanvasElement) {

    const size = Math.min(window.innerHeight, window.innerWidth) * 0.9

    this.app = new Application({
      view: canvas,
      width: size,
      height: size,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    })
    this.app.ticker.maxFPS = 60

    this.textures = new Textures()
  }
}

export default Pixi