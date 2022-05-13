// types
import { IGame } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Color from '../../utils/color'
import Map from '../map'


abstract class Entity implements IGame.Sprite {

  protected container: Container
  protected coord: IGame.Coordinate
  protected pos: IGame.Coordinate
  protected color: Color

  public map: Map

  constructor(map: Map) {
    this.map = map
    this.coord = { x: 0, y: 0 }
    this.pos = { x: 0, y: 0 }
    this.color = new Color(0)
    this.container = new Container()
    this.buildContainer()
  }

  protected buildContainer() { }

  public abstract size(): number

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }

  public getPos(): IGame.Position {
    return this.pos
  }

  public setPos(pos: IGame.Position) {
    this.pos = pos
    this.coord = this.map.coord(pos)
    this.container.position.x = this.pos.x
    this.container.position.y = this.pos.y
  }

  public getCoord(): IGame.Position {
    return this.coord
  }

  public setCoord(coord: IGame.Position) {
    this.coord = coord
    this.pos = this.map.pos(coord)
    this.container.position.x = this.pos.x
    this.container.position.y = this.pos.y
  }

  public getColor(): Color {
    return this.color
  }

  public setColor(color: Color) {
    if (this.color.hex() == color.hex()) return
    this.color = color
    this.buildContainer()
  }
}

export default Entity