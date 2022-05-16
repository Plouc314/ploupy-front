// types
import { IGame } from '../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Tile from './entity/tile'


class Map implements IGame.Sprite {

  public dimension: IGame.Dimension
  private tiles: Tile[][]
  private container: Container

  constructor(dim: IGame.Dimension) {
    this.dimension = { ...dim }
    this.tiles = []
    this.container = this.buildMap()
  }

  private buildMap(): Container {
    this.tiles = []
    const container = new Container()
    for (let x = 0; x < this.dimension.x; x++) {
      const col: Tile[] = []
      this.tiles.push(col)

      for (let y = 0; y < this.dimension.y; y++) {
        const tile = new Tile(this, { x, y })
        col.push(tile)
        container.addChild(tile.child())
      }
    }
    return container
  }

  public setOnClick(onClick: (coord: IGame.Coordinate) => void) {
    for (const col of this.tiles) {
      for (const tile of col) {
        tile.onClick = () => onClick(tile.getCoord())
      }
    }
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

  public tile(coord: IGame.Coordinate): Tile | null {
    if (
      coord.x < 0 ||
      coord.x >= this.dimension.x ||
      coord.y < 0 ||
      coord.y >= this.dimension.y
    ) {
      return null
    }
    return this.tiles[coord.x][coord.y]
  }

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Map