// types
import { IGame, IModel } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// utils
import Color from '../../utils/color'
import Context from '../context'

class Select implements IGame.Sprite {

  public static readonly COLOR = Color.fromRgb({ r: 200, g: 200, b: 200 })
  public static readonly LINE_WIDTH = 0.03

  public context: Context

  private container: Container
  private start: IGame.Position
  private end: IGame.Position

  constructor(context: Context) {
    this.context = context
    this.container = new Container()
    this.container.visible = false
    this.start = { x: 0, y: 0 }
    this.end = { x: 0, y: 0 }
  }

  public getStart(): IGame.Position {
    return this.start
  }

  public getEnd(): IGame.Position {
    return this.end
  }

  public getVisible(): boolean {
    return this.container.visible
  }

  public setStart(pos: IGame.Position) {
    this.start = { ...pos }
    this.buildContainer()
  }

  public setEnd(pos: IGame.Position) {
    this.end = { ...pos }
    this.buildContainer()
  }

  public setVisisble(v: boolean) {
    this.container.visible = v
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()

    surf.lineStyle(
      this.context.unit * Select.LINE_WIDTH, Select.COLOR.hex()
    )
      .moveTo(this.start.x, this.start.y)
      .lineTo(this.start.x, this.end.y)
      .lineTo(this.end.x, this.end.y)
      .lineTo(this.end.x, this.start.y)
      .lineTo(this.start.x, this.start.y)

    this.container.addChild(surf)
  }

  public update(dt: number): void { }

  public child(): Container {
    return this.container
  }
}

export default Select