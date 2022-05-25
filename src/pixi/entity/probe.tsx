// types
import { IGame, IModel } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'
import Tile from './tile'


class Probe extends Entity {

  public static readonly SIZE = 10
  public static readonly LINE_WIDTH = 3

  public alive: boolean
  private player: Player
  /** target (unit: coord) */
  private target: IGame.Coordinate

  /** Movement vector (unit: pos) */
  private vector: IGame.Position

  constructor(player: Player, model: IModel.Probe) {
    super(model.id, player.map)
    this.player = player
    this.buildContainer()

    this.alive = model.alive
    this.setCoord(model.pos)
    this.target = model.target
    this.vector = this.computeMoveVector()
  }

  public size() {
    return Probe.SIZE
  }

  public setModel(model: IModel.ProbeState) {

    if (model.pos) {
      this.setCoord(model.pos)
    }
    if (model.alive !== null) {
      this.alive = model.alive
    }
    if (model.target) {
      this.target = model.target
    }
    this.vector = this.computeMoveVector()
  }

  private computeMoveVector(): IGame.Position {
    const vect = {
      x: this.target.x - this.coord.x,
      y: this.target.y - this.coord.y,
    }

    // normalize vector
    const norm = Math.sqrt(vect.x * vect.x + vect.y * vect.y)

    if (norm == 0) {
      return { x: 0, y: 0 }
    }

    vect.x /= norm
    vect.y /= norm

    // multiply by speed (unit: coord)
    vect.x *= this.config.probe_speed
    vect.y *= this.config.probe_speed
    return this.map.pos(vect)
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
    surf.beginFill(this.player.color.hex())
    surf.lineStyle(Probe.LINE_WIDTH, 0xFF0000);
    surf.drawRect(
      (Tile.SIZE - Probe.SIZE) / 2,
      (Tile.SIZE - Probe.SIZE) / 2,
      Probe.SIZE,
      Probe.SIZE,
    )
    this.container.addChild(surf)
  }
}

export default Probe