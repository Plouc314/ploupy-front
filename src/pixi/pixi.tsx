// pixijs
import { Application } from 'pixi.js'

// pixi
import Textures from './textures'


class Pixi {
  public static readonly RESIZE_DELAY = 500

  public app: Application
  public textures: Textures

  private isDelay: boolean
  private isRequest: boolean
  private lastWidth: number
  private lastHeight: number

  constructor(canvas: HTMLCanvasElement) {

    this.app = new Application({
      view: canvas,
      resizeTo: canvas.parentElement as HTMLElement,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    })
    this.app.ticker.maxFPS = 60

    this.textures = new Textures()

    this.isDelay = false
    this.isRequest = false
    this.lastWidth = 0
    this.lastHeight = 0
  }

  public resize() {

    const div = this.app.view.parentElement as HTMLElement

    // abort resize in case the dimensions didn't changed
    if (this.lastWidth == div.clientWidth && this.lastHeight == div.clientHeight) {
      return
    }
    this.isRequest = true

    if (this.isDelay) return
    this.isDelay = true

    setTimeout(() => {
      if (this.isRequest) {
        this.app.resize()
        this.lastWidth = div.clientWidth
        this.lastHeight = div.clientHeight
      }
      this.isRequest = false
      this.isDelay = false
    }, Pixi.RESIZE_DELAY)
  }
}

export default Pixi