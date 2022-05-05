// types
import { Game } from '../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Tile from './tile'
import Player from './player'

class Map implements Game.Sprite {

  public dimension: Game.Dimension
  private tiles: Tile[][]
  private container: Container

  constructor(dim: Game.Dimension) {
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

  public claimTile(player: Player, coord: Game.Coordinate): boolean {

    const tile = this.tile(coord)

    if (!tile) return false
    if (tile.owner === player) return false

    if (tile.owner) {
      tile.owner.score--
    }
    tile.setOwner(player)
    player.score++
    return true
  }

  public child(): Container {
    return this.container
  }

}

export default Map