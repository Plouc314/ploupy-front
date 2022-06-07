// types
import { IGame, IModel } from '../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Tile from './entity/tile'
import Player from './player'
import Context from './context'


class Map implements IGame.Sprite {

  public context: Context
  public dimension: IGame.Dimension
  private tiles2d: Tile[][]
  private tilesMap: Record<IGame.ID, Tile>
  private container: Container

  constructor(context: Context, model: IModel.Map<string>) {
    this.context = context
    this.dimension = { ...context.config.dim }
    this.tiles2d = []
    this.tilesMap = {}
    this.container = this.buildMap(model)
  }

  private buildMap(model: IModel.Map<string>): Container {

    // create empty 2d array
    this.tiles2d = Array(this.dimension.x).fill(0).map(v => Array(this.dimension.y)) as Tile[][]

    const container = new Container()

    for (const tm of model.tiles) {
      const tile = new Tile(this.context, { ...tm, owner: undefined })
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

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Map