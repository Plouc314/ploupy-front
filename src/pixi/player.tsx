// types
import { IGame } from '../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Keyboard from './keyboard'
import Color from '../utils/color'
import Map from './map'
import Factory from './entity/factory'
import Probe from './entity/probe'

class Player implements IGame.Sprite {

  public keyboard: Keyboard
  public map: Map

  public username: string
  public color: Color

  private factories: Factory[]
  private probes: Probe[]

  private container: Container

  constructor(username: string, color: Color, keyboard: Keyboard, map: Map) {
    this.username = username
    this.color = color

    this.keyboard = keyboard
    this.map = map

    this.factories = []
    this.probes = []

    this.container = new Container()
  }

  public addFactory(factory: Factory) {
    if (this.factories.includes(factory)) return
    this.factories.push(factory)
    this.container.addChild(factory.child())
  }

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Player