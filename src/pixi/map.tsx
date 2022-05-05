// types
import { Game } from '../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Tile from './tile'

class Map implements Game.Sprite {

  public dimension: Game.Dimension
  private tiles: Tile[][]
  private sprite: Container

  constructor(dim: Game.Dimension) {
    this.dimension = { ...dim }
    this.tiles = []
    this.sprite = this.buildMap()
  }

  private buildMap(): Container {
    this.tiles = []
    const container = new Container()
    for (let x = 0; x < this.dimension.x; x++) {
      const col: Tile[] = []
      this.tiles.push(col)

      for (let y = 0; y < this.dimension.y; y++) {
        const tile = new Tile(x, y)
        col.push(tile)
        container.addChild(tile.child())
      }
    }
    return container
  }

  public coord(pos: Game.Position): Game.Coordinate {
    return {
      x: Math.floor(pos.x / Tile.SIZE),
      y: Math.floor(pos.y / Tile.SIZE),
    }
  }

  public tile(coord: Game.Coordinate): Tile | null {
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

  public child(): Container {
    return this.sprite
  }

}

export default Map