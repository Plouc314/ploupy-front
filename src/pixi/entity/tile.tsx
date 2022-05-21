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

  public static readonly SIZE = 50
  public static readonly DEFAULT_COLOR: Color = Color.fromRgb({ r: 150, g: 150, b: 150 })

  private hover: boolean

  public owner: Player | null
  public occupation: number

  constructor(map: Map, model: IModel.Tile<Player>) {
    super(map)
    this.buildContainer()

    this.owner = model.owner
    this.occupation = model.occupation
    this.setCoord(model.coord)
    this.setColor(this.getOccupationColor())

    this.hover = false

    this.setInteractions()
  }

  public size() {
    return Tile.SIZE
  }

  public setModel(model: IModel.TileState<Player>) {
    if (model.owner !== undefined) {
      this.owner = model.owner
    }
    this.occupation = model.occupation ?? 0

    this.setCoord(model.coord)
    this.setColor(this.getOccupationColor())
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
    return Color.fromMerged(
      ...Array(10 - this.occupation).fill(Tile.DEFAULT_COLOR),
      ...Array(this.occupation).fill(this.owner.color)
    )
  }

  private setInteractions() {
    this.container.interactive = true
    this.container.on("pointerover", () => {
      if (this.hover) return
      this.hover = true
      this.setColor(this.color.withDiff(-30))
    })
    this.container.on("pointerout", () => {
      if (!this.hover) return
      this.hover = false
      this.setColor(this.color.withDiff(30))
    })
  }
}

export default Tile