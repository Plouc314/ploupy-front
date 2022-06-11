// types
import { IGame, IModel, RGB } from '../../../types'

// pixi.js
import { Graphics } from 'pixi.js';

// pixi
import Color from '../../utils/color';
import Entity from './entity';
import Map from '../map';
import Player from '../player';
import Context from '../context';

class Tile extends Entity {

  public static readonly SIZE = 1
  public static readonly DEFAULT_COLOR = Color.fromRgb(50, 50, 50)
  public static readonly LINE_WIDTH = 0.04

  public owner: Player | undefined
  public occupation: number

  /**
   * If the tile is currently hovered by the pointer
   */
  private hovered: boolean

  /**
   * if the tile is currently in highlight state,
   * it will potentially toggle/untoggle highlighted on `setModel`
   */
  private isHighlightState: boolean
  /** highlighted indicates that a building can be built on tile */
  private highlighted: boolean

  constructor(context: Context, model: IModel.Tile<Player>) {
    super(model.id, context)
    this.buildContainer()

    this.owner = model.owner
    this.occupation = model.occupation
    this.setCoord(model.coord)
    this.setColor(this.getOccupationColor())

    this.hovered = false
    this.isHighlightState = false
    this.highlighted = false
  }

  public setModel(model: IModel.TileState<Player>) {
    if (model.owner !== null) {
      this.owner = model.owner
      if (this.owner?.isTileHighlightState) {
        this.isHighlightState = true
      }
    }
    this.occupation = model.occupation ?? 0

    if (model.coord) {
      this.setCoord(model.coord)
    }

    // set highlighted BEFORE color -> setColor trigger buildContainer
    this.highlighted = this.isHighlightState && this.canBuild()

    this.setColor(this.getOccupationColor())
  }

  /** Set the hover effect on the tile */
  public setHover(hover: boolean) {
    this.hovered = hover
    this.buildContainer()
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()

    // select tile color
    let color: Color = this.color
    if (this.hovered || this.highlighted) {
      color = this.color.withDiff(30)
    }
    surf.beginFill(color.hex())

    const sizes = this.context.sizes

    surf.drawRect(0, 0, sizes.tile, sizes.tile)
    this.container.addChild(surf)
  }

  /**
   * Return if a building can be build on tile
   * NOTE: assumes that the owner exists and is the correct one
   */
  private canBuild(): boolean {
    return this.occupation >= this.context.config.building_occupation_min
  }

  /**
   * Set the highlight state
   * if true and the tile can support a building -> highlight,
   * if false -> unhighlight
   */
  public setHighlightState(value: boolean) {
    this.isHighlightState = value

    if (!this.isHighlightState) {
      this.highlighted = false
    } else if (this.canBuild()) {
      this.highlighted = true
    }
    this.buildContainer()
  }

  /** Return the color corresponding to the occupation color */
  private getOccupationColor(): Color {
    if (!this.owner) {
      return Tile.DEFAULT_COLOR
    }
    const d = this.context.config.max_occupation + 2 - this.occupation
    const o = this.occupation > 0 ? this.occupation + 2 : 0
    return Color.fromMerged(
      ...Array(d).fill(Tile.DEFAULT_COLOR),
      ...Array(o).fill(this.owner.color)
    )
  }

}

export default Tile