// types
import { IGame } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'
import Tile from './tile'
import Color from '../../utils/color'

export enum ProbeState {
  FARMING = "FARMING",
  SELECTED = "SELECTED",
}

class Probe extends Entity {

  public static readonly SIZE = 0.25
  public static readonly LINE_WIDTH = 0.04

  public static readonly FARM_COLOR = Color.fromRgb(255, 255, 255)
  public static readonly SELECTED_COLOR = Color.fromRgb(150, 255, 150)

  public alive: boolean
  private player: Player
  private state: ProbeState
  private outlineColor: Color

  /** target (unit: coord) */
  private target: IGame.Coordinate

  /** Movement vector (unit: pos) */
  private vector: IGame.Position

  constructor(player: Player, model: IGame.ProbeState) {
    super(model.id, player.context)

    if (!this.assertCompleteModel(model)) {
      throw new Error("Incomplete model: " + model)
    }

    this.player = player
    this.alive = !model.death
    this.state = ProbeState.FARMING
    this.outlineColor = Probe.FARM_COLOR

    this.buildContainer()

    // set the position - update the unit (coordinate -> pixel)
    this.setPos(this.context.pos(model.pos))

    this.target = model.target
    this.vector = this.computeMoveVector()
  }

  private assertCompleteModel(model: IGame.ProbeState): model is IGame.Probe {
    if (model.pos === null) return false
    if (model.target === null) return false
    if (model.policy === null) return false
    return true
  }

  public setModel(model: IGame.ProbeState) {

    if (model.pos) {
      // set the position - update the unit (coordinate -> pixel)
      this.setPos(this.context.pos(model.pos))
    }
    this.alive = !model.death ?? this.alive
    this.target = model.target ?? this.target
    this.vector = this.computeMoveVector()
  }

  public setState(state: ProbeState) {
    this.state = state
    if (this.state == ProbeState.FARMING) {
      this.outlineColor = Probe.FARM_COLOR
    } else if (this.state == ProbeState.SELECTED) {
      this.outlineColor = Probe.SELECTED_COLOR
    }
    this.buildContainer()
  }

  private computeMoveVector(): IGame.Position {
    // convert target to position
    const target = this.context.pos(this.target)

    const vect = {
      x: target.x - this.pos.x,
      y: target.y - this.pos.y,
    }

    // normalize vector
    const norm = Math.sqrt(vect.x * vect.x + vect.y * vect.y)

    if (norm == 0) {
      return { x: 0, y: 0 }
    }

    vect.x /= norm
    vect.y /= norm

    // multiply by speed (unit: coord)
    vect.x *= this.context.config.probe_speed
    vect.y *= this.context.config.probe_speed
    return { x: this.context.unit * vect.x, y: this.context.unit * vect.y }
  }

  public update(dt: number): void {
    this.setPos({
      x: this.pos.x + this.vector.x * dt,
      y: this.pos.y + this.vector.y * dt,
    })
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.player.color.withSharpen(50).hex())

    const sizes = this.context.sizes
    const margin = (sizes.tile - sizes.probe) / 2

    surf.drawRect(
      margin,
      margin,
      sizes.probe,
      sizes.probe,
    )
    surf.lineStyle(
      this.context.unit * Probe.LINE_WIDTH, this.outlineColor.hex()
    )
      .moveTo(margin, margin)
      .lineTo(margin + sizes.probe, margin)
      .lineTo(margin + sizes.probe, margin + sizes.probe)
      .lineTo(margin, margin + sizes.probe)
      .lineTo(margin, margin)

    this.container.addChild(surf)
  }
}

export default Probe