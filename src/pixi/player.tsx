// types
import { IGame, IModel } from '../../types'

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
  public money: number
  public score: number
  public color: Color

  private factories: Factory[]
  private probes: Probe[]

  private container: Container

  constructor(model: IModel.Player, color: Color, keyboard: Keyboard, map: Map) {
    this.username = model.username
    this.money = model.money
    this.score = model.score
    this.color = color

    this.keyboard = keyboard
    this.map = map

    this.factories = model.factories.map(m => new Factory(this, m))
    this.probes = model.probes.map(m => new Probe(this, m))

    this.container = new Container()
  }

  public setModel(model: IModel.PlayerState) {
    this.money = model.money ?? this.money
    this.score = model.score ?? this.score

    for (const fm of model.factories) {
      const factory = this.factories.find(f => {
        const coord = f.getCoord()
        return coord.x == fm.coord.x && coord.y == fm.coord.y
      })
      if (!factory) continue
      factory.setModel(fm)
    }
    for (const pm of model.probes) {
      const probe = this.probes.find(f => {
        const pos = f.getCoord()
        return pos.x == pm.pos.x && pos.y == pm.pos.y
      })
      if (!probe) continue
      probe.setModel(pm)
    }
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