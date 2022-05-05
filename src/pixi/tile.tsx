// types
import { Game } from '../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js';

// pixi
import Color from './color';
import Player from './player';

class Tile implements Game.Sprite {

  public static readonly SIZE = 50
  public static readonly DEFAULT_COLOR: Game.RGB = { r: 200, g: 200, b: 200 }
  public readonly coord: Game.Coordinate

  private sprite: Graphics

  public color: Color
  public owner: Player | null

  constructor(x: number, y: number) {
    this.coord = { x, y }
    this.color = Color.fromRgb(Tile.DEFAULT_COLOR)
    this.owner = null
    this.sprite = new Graphics()
    this.buildSprite()
  }

  public setOwner(owner: Player | null) {
    if (this.owner === owner) return
    let color: Color
    if (owner === null) {
      color = Color.fromRgb(Tile.DEFAULT_COLOR)
    } else {
      color = owner.tileColor()
    }
    this.setColor(color)
    this.owner = owner
  }

  private setColor(color: Color) {
    if (this.color.hex() == color.hex()) return
    this.color = color
    this.buildSprite()
  }

  private buildSprite() {
    this.sprite.clear()
    this.sprite.beginFill(this.color.hex())
    this.sprite.drawRect(0, 0, Tile.SIZE, Tile.SIZE)
    this.sprite.position.x = Tile.SIZE * this.coord.x
    this.sprite.position.y = Tile.SIZE * this.coord.y
  }

  public child(): Container {
    return this.sprite
  }
}

export default Tile