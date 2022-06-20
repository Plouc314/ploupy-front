// types
import { IGame } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'
import Tile from './tile'
import Color from '../../utils/color'


class Turret extends Entity {

  public static readonly SIZE = 0.6
  public static readonly LINE_WIDTH = 0.04

  public alive: boolean
  private player: Player

  constructor(player: Player, model: IGame.Turret) {
    super(model.id, player.context)
    this.player = player
    this.buildContainer()

    this.alive = model.alive
    this.setCoord(model.coord)
  }

  public setModel(model: IGame.TurretState) {
    if (model.coord) {
      this.setCoord(model.coord)
    }
    if (model.alive !== null) {
      this.alive = model.alive
    }
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.player.color.withSharpen(60).withDiff(-60).hex())

    const sizes = this.context.sizes
    const margin = (sizes.tile - sizes.turret) / 2

    surf.drawPolygon([
      margin, margin,
      margin + sizes.turret, margin,
      margin + sizes.turret / 2, margin + sizes.turret,
    ])

    this.container.addChild(surf)
  }
}

export default Turret