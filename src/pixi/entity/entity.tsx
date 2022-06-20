// types
import { IGame, ICore } from '../../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Color from '../../utils/color'
import Context from '../context'


abstract class Entity implements IGame.Sprite {

  protected container: Container
  protected id: IGame.ID
  protected coord: IGame.Coordinate
  protected pos: IGame.Coordinate
  protected color: Color

  public context: Context

  constructor(id: IGame.ID, context: Context) {
    this.context = context
    this.id = id
    this.coord = { x: 0, y: 0 }
    this.pos = { x: 0, y: 0 }
    this.color = new Color(0)
    this.container = new Container()
  }

  protected buildContainer() { }

  public update(dt: number): void { }

  public child(): Container {
    return this.container
  }

  public getId(): IGame.ID {
    return this.id
  }

  public getPos(): IGame.Position {
    return { ...this.pos }
  }

  /**unit: pixel */
  public setPos(pos: IGame.Position) {
    this.pos = { ...pos }
    this.coord = this.context.coord(pos)
    this.container.position.x = this.pos.x
    this.container.position.y = this.pos.y
  }

  public getCoord(): IGame.Position {
    return { ...this.coord }
  }

  /**unit: coordinate */
  public setCoord(coord: IGame.Position) {
    this.coord = { ...coord }
    this.pos = this.context.pos(coord)
    this.container.position.x = this.pos.x
    this.container.position.y = this.pos.y
  }

  /**
   * Return the center of the entity (unit: pixel)
   */
  public getCenter(): IGame.Position {
    const sizes = this.context.sizes
    return {
      x: this.pos.x + sizes.tile / 2,
      y: this.pos.y + sizes.tile / 2,
    }
  }

  public getColor(): Color {
    return this.color
  }

  public setColor(color: Color) {
    if (this.color.hex() == color.hex()) return
    this.color = color
    this.buildContainer()
  }

  /**
   * Executed when the context is updated,
   * for example: on resize of the canvas
   */
  public onContextUpdate() {
    this.setCoord(this.coord)
    this.buildContainer()
  }
}

export default Entity