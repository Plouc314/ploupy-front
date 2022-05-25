// types
import { IGame, IModel } from '../../types'

// pixi.js
import { Container, InteractionEvent } from 'pixi.js'

// pixi
import Tile from './entity/tile'
import Player from './player'
import Pixi from './pixi'


class Map implements IGame.Sprite {

  public config: IModel.GameConfig
  public dimension: IGame.Dimension
  private tiles2d: Tile[][]
  private tilesMap: Record<IGame.ID, Tile>
  private container: Container

  /** Tile that is currently hovered */
  private currentTile: Tile | null

  constructor(config: IModel.GameConfig, model: IModel.Map<string>) {
    this.config = config
    this.dimension = { ...config.dim }
    this.tiles2d = []
    this.tilesMap = {}
    this.container = this.buildMap(model)
    this.currentTile = null
  }

  private buildMap(model: IModel.Map<string>): Container {

    // create empty 2d array
    this.tiles2d = Array(this.dimension.x).fill(0).map(v => Array(this.dimension.y)) as Tile[][]

    const container = new Container()

    for (const tm of model.tiles) {
      const tile = new Tile(this, { ...tm, owner: undefined })
      this.tiles2d[tm.coord.x][tm.coord.y] = tile
      this.tilesMap[tm.id] = tile
      container.addChild(tile.child())
    }
    return container
  }

  /**
   * Must be called after the constructor in case some tiles have owners
   */
  public setModel(model: IModel.MapState<Player>) {
    if (!model.tiles) return
    for (const tm of model.tiles) {
      const tile = this.tile(tm.id)
      if (!tile) continue

      tile.setModel(tm)
    }
  }

  /**
   * Return the coordinates corresponding to the mouse position
   */
  private getMouseCoord(e: InteractionEvent): IGame.Coordinate {
    const pos = e.data.global
    return this.coord({ x: pos.x, y: pos.y - 50 })
  }

  public setOnClick(onClick: (coord: IGame.Coordinate) => void) {
    this.container.interactive = true
    // this.container.interactiveChildren = false

    // hover
    this.container.on("pointermove", (e) => {
      const coord = this.getMouseCoord(e)
      const tile = this.tile(coord)
      if (this.currentTile === tile) return
      if (this.currentTile) {
        this.currentTile.setHover(false)
      }
      if (tile) {
        tile.setHover(true)
      }
      this.currentTile = tile
    })

    // interactions
    this.container.on("pointertap", (e) => {
      const coord = this.getMouseCoord(e)
      const tile = this.tile(coord)
      if (!tile) return
      onClick(tile.getCoord())
    })
  }

  /**
   * Convert the given position to coordinate
   * if keepPrecision is specified, don't floor coordinate
   */
  public coord(pos: IGame.Position, keepPrecision?: boolean): IGame.Coordinate {
    const floor = keepPrecision ? (x: number) => x : Math.floor
    return {
      x: floor(pos.x / Tile.SIZE),
      y: floor(pos.y / Tile.SIZE),
    }
  }

  /**
   * Convert the given coordinate to position
   */
  public pos(coord: IGame.Coordinate): IGame.Position {
    return {
      x: coord.x * Tile.SIZE,
      y: coord.y * Tile.SIZE,
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

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Map