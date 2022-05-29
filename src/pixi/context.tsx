// types
import { IGame, IModel } from "../../types"

// pixi
import Pixi from "./pixi"
import Color from "../utils/color"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import Comm from "./comm"
import Factory from "./entity/factory"
import Probe from "./entity/probe"
import Interactions from "./interactions"
import Tile from "./entity/tile"

/**
 * Graphic context
 * 
 * Handle conversion between pixel - coordinate
 */
class Context {

  public static readonly MARGIN = 30

  public pixi: Pixi
  public config: IModel.GameConfig

  /**
   * Number of pixels equivalent to 1 coordinate
   */
  public unit: number

  constructor(pixi: Pixi, config: IModel.GameConfig) {
    this.pixi = pixi
    this.config = config
    this.unit = Math.min(
      (pixi.app.view.width - 2 * Context.MARGIN) / config.dim.x,
      (pixi.app.view.height - UI.HEIGHT - 2 * Context.MARGIN) / config.dim.y,
    )
  }

  /**
   * Convert the given position to coordinate
   * if keepPrecision is specified, don't floor coordinate
   */
  public coord(pos: IGame.Position, keepPrecision?: boolean): IGame.Coordinate {
    const floor = keepPrecision ? (x: number) => x : Math.floor
    return {
      x: floor(pos.x / this.unit),
      y: floor(pos.y / this.unit),
    }
  }

  /**
   * Convert the given coordinate to position
   */
  public pos(coord: IGame.Coordinate): IGame.Position {
    return {
      x: coord.x * this.unit,
      y: coord.y * this.unit,
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

  public sizes(): IModel.ContextSizes {
    return {
      dim: this.pos(this.config.dim),
      tile: Tile.SIZE * this.unit,
      factory: Factory.SIZE * this.unit,
      probe: Probe.SIZE * this.unit,
    }
  }
}

export default Context