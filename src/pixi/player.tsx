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

  public map: Map
  public config: IModel.GameConfig

  public username: string
  public money: number
  public score: number
  public color: Color

  private factories: Factory[]
  private probes: Probe[]

  private container: Container

  constructor(model: IModel.Player, color: Color, map: Map) {
    this.username = model.username
    this.money = model.money
    this.score = model.score
    this.color = color

    this.map = map
    this.config = map.config

    this.factories = model.factories.map(m => new Factory(this, m))
    this.probes = model.probes.map(m => new Probe(this, m))

    this.container = new Container()
  }

  public setModel(model: IModel.PlayerState) {
    this.money = model.money ?? this.money
    this.score = model.score ?? this.score

    // update factories
    for (const fm of model.factories) {
      const factory = this.factories.find(f => f.getId() === fm.id)
      if (!factory) continue
      factory.setModel(fm)
    }
    // remove dead factories
    this.factories
      .filter(f => !f.alive)
      .forEach(f => this.container.removeChild(f.child()))

    this.factories = this.factories.filter(f => f.alive)

    // update probes
    for (const pm of model.probes) {
      const probe = this.probes.find(p => p.getId() === pm.id)
      if (!probe) continue
      probe.setModel(pm)
    }
    // remove dead probes
    this.probes
      .filter(p => !p.alive)
      .forEach(p => this.container.removeChild(p.child()))

    this.probes = this.probes.filter(p => p.alive)
  }

  public addFactory(factory: Factory) {
    if (this.factories.includes(factory)) return
    this.factories.push(factory)
    this.container.addChild(factory.child())
  }

  public addProbe(probe: Probe) {
    if (this.probes.includes(probe)) return
    this.probes.push(probe)
    this.container.addChild(probe.child())
  }

  public update(dt: number) {
    for (const probe of this.probes) {
      probe.update(dt)
    }
  }

  public child(): Container {
    return this.container
  }
}

export default Player