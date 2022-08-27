// types
import { IGame, ICore } from "../../types"

// pixi
import Pixi from "./pixi"
import UI from "./ui"
import Map from "./map"
import Factory from "./entity/factory"
import Probe from "./entity/probe"
import Tile from "./entity/tile"
import Turret from "./entity/turret"
import Interactions from "./interactions"

/**
 * Global context
 * 
 * Store game config
 * Handle conversion between pixel - coordinate
 */
class Context {

  public pixi: Pixi
  public config: ICore.GameConfig
  public metadata: ICore.GameMetadata

  public sizes: IGame.ContextSizes

  /**
   * Number of pixels equivalent to 1 coordinate
   */
  public unit: number

  constructor(pixi: Pixi, config: ICore.GameConfig, metadata: ICore.GameMetadata) {
    this.pixi = pixi
    this.config = config
    this.metadata = metadata

    this.sizes = {} as IGame.ContextSizes
    this.unit = 0

    this.update()
  }

  /**
   * Update context sizes / unit
   */
  public update() {
    this.unit = Math.min(
      this.pixi.app.view.width / (this.metadata.dim.x + 2 * Map.MARGIN),
      this.pixi.app.view.height / (this.metadata.dim.y + 2 * Map.MARGIN),
    )

    const dimMap = {
      x: (this.metadata.dim.x + 2 * Map.MARGIN) * this.unit,
      y: (this.metadata.dim.y + 2 * Map.MARGIN) * this.unit,
    }

    this.sizes = {
      dimMap: dimMap,
      tile: Tile.SIZE * this.unit,
      factory: Factory.SIZE * this.unit,
      turret: Turret.SIZE * this.unit,
      probe: Probe.SIZE * this.unit,
      ui: {
        x: dimMap.x,
        height: dimMap.y,
        width: this.pixi.app.view.width - dimMap.x,
        cursor: Interactions.CURSOR_SIZE * this.unit,
      },
    }
  }

  /**
   * Convert the given position to coordinate
   * if keepPrecision is specified, don't floor coordinate
   */
  public coord(pos: IGame.Position, keepPrecision?: boolean): IGame.Coordinate {
    const floor = keepPrecision ? (x: number) => x : Math.floor
    return {
      x: floor((pos.x - this.sizes.tile * Map.MARGIN) / this.unit),
      y: floor((pos.y - this.sizes.tile * Map.MARGIN) / this.unit),
    }
  }

  /**
   * Convert the given coordinate to position
   * NOTE: will translate the coordinate to match layout position
   */
  public pos(coord: IGame.Coordinate): IGame.Position {
    return {
      x: (coord.x + Tile.SIZE * Map.MARGIN) * this.unit,
      y: (coord.y + Tile.SIZE * Map.MARGIN) * this.unit,
    }
  }

  /**
   * Return if the position is in the context dimension
   */
  public clampToDim(pos: IGame.Position): IGame.Position {
    return {
      x: Math.max(Math.min(pos.x, this.pixi.app.view.width), 0),
      y: Math.max(Math.min(pos.y, this.pixi.app.view.height), 0),
    }
  }

  /**
   * Scale a map of sizes (designed for ui sizes)
   * The given sizes units should be pixel-like
   * TEMP: (for now, leave the sizes untouched)
   */
  public scaleUI<T extends {}>(sizes: T): T {
    const scaled: any = {}
    for (const [key, value] of Object.entries(sizes)) {
      scaled[key] = value
    }
    return scaled as T
  }

}

export default Context