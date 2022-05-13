// types
import { IGame, RGB } from '../../../types'

// pixi.js
import { Graphics } from 'pixi.js';

// pixi
import Color from '../../utils/color';
import Entity from './entity';
import Map from '../map';

class Tile extends Entity {

  public static readonly SIZE = 50
  public static readonly DEFAULT_COLOR: RGB = { r: 200, g: 200, b: 200 }

  constructor(map: Map, coord: IGame.Coordinate) {
    super(map)
    this.setCoord(coord)
    this.setColor(Color.fromRgb(Tile.DEFAULT_COLOR))
  }

  public size() {
    return Tile.SIZE
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.color.hex())
    surf.drawRect(0, 0, this.size(), this.size())
    this.container.addChild(surf)
  }
}

export default Tile