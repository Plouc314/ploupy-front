// types
import { IGame, IModel, RGB } from '../../../types'

// pixi.js
import { Graphics } from 'pixi.js';

// pixi
import Color from '../../utils/color';
import Entity from './entity';
import Map from '../map';
import Player from '../player';

class Tile extends Entity {

  public static readonly SIZE = 40
  public static readonly DEFAULT_COLOR: Color = Color.fromRgb({ r: 50, g: 50, b: 50 })

  private hover: boolean

  public owner: Player | undefined
  public occupation: number

  constructor(map: Map, model: IModel.Tile<Player>) {
    super(model.id, map)
    this.buildContainer()

    this.owner = model.owner
    this.occupation = model.occupation
    this.setCoord(model.coord)
    this.setColor(this.getOccupationColor())

    this.hover = false
  }

  public size() {
    return Tile.SIZE
  }

  public setModel(model: IModel.TileState<Player>) {
    if (model.owner !== null) {
      this.owner = model.owner
    }
    this.occupation = model.occupation ?? 0

    if (model.coord) {
      this.setCoord(model.coord)
    }
    this.setColor(this.getOccupationColor())
  }

  /** Set the hover effect on the tile */
  public setHover(hover: boolean) {
    if (this.hover == hover) return
    this.hover = hover
    const diff = hover ? 30 : -30
    this.setColor(this.color.withDiff(diff))
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.color.hex())
    surf.drawRect(0, 0, this.size(), this.size())
    this.container.addChild(surf)
  }

  /** Return the color corresponding to the occupation color */
  private getOccupationColor(): Color {
    if (!this.owner) {
      return Tile.DEFAULT_COLOR
    }
    const d = this.map.config.max_occupation + 2 - this.occupation
    const o = this.occupation > 0 ? this.occupation + 2 : 0
    return Color.fromMerged(
      ...Array(d).fill(Tile.DEFAULT_COLOR),
      ...Array(o).fill(this.owner.color)
    )
  }

}

export default Tile