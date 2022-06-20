// types
import { IGame } from '../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Tile from './entity/tile'
import Player from './player'
import Context from './context'
import Color from '../utils/color'


class Map implements IGame.Sprite {

  /** margin: unit tile (thus coord) */
  public static readonly MARGIN = 1
  public static readonly MARGIN_COLOR = Color.fromRgb(30, 30, 30)

  public context: Context
  public dimension: IGame.Dimension
  private tiles2d: Tile[][]
  private tilesMap: Record<IGame.ID, Tile>
  private borders: Tile[]
  private container: Container

  constructor(context: Context, model: IGame.Map<string>) {
    this.context = context
    this.dimension = { ...context.config.dim }
    this.tiles2d = []
    this.tilesMap = {}
    this.borders = []
    this.container = this.buildMap(model)
  }

  private buildMap(model: IGame.Map<string>): Container {

    // create empty 2d array
    this.tiles2d = Array(this.dimension.x).fill(0).map(v => Array(this.dimension.y)) as Tile[][]

    const container = new Container()

    // add borders tiles
    this.buildBorders(container)

    for (const tm of model.tiles) {
      const tile = new Tile(this.context, { ...tm, owner: undefined })
      this.tiles2d[tm.coord.x][tm.coord.y] = tile
      this.tilesMap[tm.id] = tile
      container.addChild(tile.child())
    }
    return container
  }

  private buildBorders(container: Container) {

    const width = this.dimension.x + 2 * Map.MARGIN
    const height = this.dimension.y + 2 * Map.MARGIN

    this.borders = Array(2 * width + 2 * height - 4)
    let idx = 0

    for (let x = 0; x < width; x++) {
      for (let y of [-1, height - 2]) {
        const tile = new Tile(this.context, {
          id: "border-" + idx,
          coord: { x: x - 1, y: y },
          owner: undefined,
          occupation: 0,
        })
        tile.setColor(Map.MARGIN_COLOR)
        this.borders[idx++] = tile
        container.addChild(tile.child())
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x of [-1, width - 2]) {
        const tile = new Tile(this.context, {
          id: "border-" + idx,
          coord: { x: x, y: y - 1 },
          owner: undefined,
          occupation: 0,
        })
        tile.setColor(Map.MARGIN_COLOR)
        this.borders[idx++] = tile
        container.addChild(tile.child())
      }
    }
  }

  /**
   * Must be called after the constructor in case some tiles have owners
   */
  public setModel(model: IGame.MapState<Player>) {
    if (!model.tiles) return
    for (const tm of model.tiles) {
      const tile = this.tile(tm.id)
      if (!tile) continue

      tile.setModel(tm)
    }
  }

  /**
   * Return a tile given its id or coordinate
   */
  public tile(key: IGame.Coordinate | IGame.ID): Tile | null {
    if (typeof key === "string") {
      if (!(key in this.tilesMap)) throw new Error(`invalid tile id ${key}`)
      return this.tilesMap[key] ?? null
    }
    if (
      key.x < 0 ||
      key.x >= this.dimension.x ||
      key.y < 0 ||
      key.y >= this.dimension.y
    ) {
      return null
    }
    return this.tiles2d[key.x][key.y]
  }

  /**
   * Return a flattened array of tiles of the map
   */
  public allTiles(): Tile[] {
    return ([] as Tile[]).concat(...this.tiles2d)
  }

  /**
   * Return if the coordinate is in the extended map:
   * the map plus its margins (as `Map.MARGIN`)
   */
  public isInExtendedMap(coord: IGame.Coordinate) {
    return (
      coord.x >= -Map.MARGIN &&
      coord.x < this.dimension.x + Map.MARGIN &&
      coord.y >= -Map.MARGIN &&
      coord.y < this.dimension.y + Map.MARGIN
    )
  }

  /**
   * Executed when the context is updated,
   * for example: on resize of the canvas
   */
  public onContextUpdate() {
    for (const col of this.tiles2d) {
      for (const tile of col) {
        tile.onContextUpdate()
      }
    }
    for (const tile of this.borders) {
      tile.onContextUpdate()
    }
  }

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Map