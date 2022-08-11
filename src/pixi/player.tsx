// types
import { IGame, ICore } from '../../types'

// pixi.js
import { Container } from 'pixi.js'

// pixi
import Color from '../utils/color'
import Map from './map'
import Factory from './entity/factory'
import Probe from './entity/probe'
import Context from './context'
import Turret from './entity/turret'
import Animations from './animations'

class Player implements IGame.Sprite {

  public map: Map
  public animations: Animations
  public context: Context

  public username: string
  public money: number
  public alive: boolean
  public income: number
  public color: Color

  public factories: Factory[]
  public turrets: Turret[]
  public probes: Probe[]

  /**
   * if the player's tile that can support a building are
   * highlighted, used by `Tile`, set in `Interactions`
   */
  public isTileHighlightState: boolean

  private container: Container
  private layoutFactories: Container
  private layoutTurrets: Container
  private layoutProbes: Container

  constructor(model: IGame.PlayerState, color: Color, map: Map, animations: Animations) {

    if (!this.assertCompleteModel(model)) {
      throw new Error("Incomplete model: " + model)
    }

    this.username = model.username
    this.money = model.money
    this.alive = !model.death
    this.income = model.income
    this.color = color

    this.map = map
    this.animations = animations
    this.context = map.context

    this.factories = []
    this.turrets = []
    this.probes = []

    this.isTileHighlightState = false

    this.layoutFactories = new Container()
    this.layoutTurrets = new Container()
    this.layoutProbes = new Container()
    this.container = new Container()
    this.container.addChild(this.layoutFactories)
    this.container.addChild(this.layoutTurrets)
    this.container.addChild(this.layoutProbes)

    // build probes / factories / turrets
    model.factories.forEach(m => this.addFactory(new Factory(this, m)))
    model.turrets.forEach(m => this.addTurret(new Turret(this, m)))
    model.probes.forEach(m => this.addProbe(new Probe(this, m)))
  }

  private assertCompleteModel(model: IGame.PlayerState): model is IGame.Player {
    if (model.money === null) return false
    if (model.income === null) return false
    return true
  }

  public setModel(model: IGame.PlayerState) {
    this.money = model.money ?? this.money
    this.alive = !model.death ?? this.alive
    this.income = model.income ?? this.income

    // update factories
    for (const fm of model.factories) {
      const factory = this.factories.find(f => f.getId() === fm.id)
      if (factory) {
        factory.setModel(fm)
      } else {
        // create new factory
        const factory = new Factory(this, fm)
        this.addFactory(factory)
      }
    }
    // remove dead factories
    this.factories
      .filter(f => !f.alive)
      .forEach(f => this.layoutFactories.removeChild(f.child()))

    this.factories = this.factories.filter(f => f.alive)


    // update turrets
    for (const tm of model.turrets) {
      const turret = this.turrets.find(f => f.getId() === tm.id)
      if (turret) {
        turret.setModel(tm)
      } else {
        // create new turret
        const turret = new Turret(this, tm as IGame.Turret)
        this.addTurret(turret)
      }
    }
    // remove dead turrets
    this.turrets
      .filter(t => !t.alive)
      .forEach(t => this.layoutTurrets.removeChild(t.child()))

    this.turrets = this.turrets.filter(t => t.alive)


    // update probes
    for (const pm of model.probes) {
      const probe = this.probes.find(p => p.getId() === pm.id)
      if (probe) {
        probe.setModel(pm)
      } else {
        // create new probe
        const probe = new Probe(this, pm as IGame.Probe)
        this.addProbe(probe)
      }

    }
    // remove dead probes
    this.probes
      .filter(p => !p.alive)
      .forEach(p => this.layoutProbes.removeChild(p.child()))

    this.probes = this.probes.filter(p => p.alive)
  }

  public addFactory(factory: Factory) {
    if (this.factories.includes(factory)) return
    this.factories.push(factory)
    this.layoutFactories.addChild(factory.child())
  }

  public addTurret(turret: Turret) {
    if (this.turrets.includes(turret)) return
    this.turrets.push(turret)
    this.layoutTurrets.addChild(turret.child())
  }

  public addProbe(probe: Probe) {
    if (this.probes.includes(probe)) return
    this.probes.push(probe)
    this.layoutProbes.addChild(probe.child())
  }

  public removeProbe(probe: Probe) {
    if (!this.probes.includes(probe)) return
    this.probes = this.probes.filter(p => p.getId() !== probe.getId())
    this.layoutProbes.removeChild(probe.child())
  }

  /**
   * Executed when the context is updated,
   * for example: on resize of the canvas
   */
  public onContextUpdate() {
    for (const factory of this.factories) {
      factory.onContextUpdate()
    }
    for (const turret of this.turrets) {
      turret.onContextUpdate()
    }
    for (const probe of this.probes) {
      probe.onContextUpdate()
    }
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