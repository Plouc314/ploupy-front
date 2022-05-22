// types
import { IGame, IModel } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'
import Tile from './tile'


class Probe extends Entity {

  public static readonly SIZE = 20

  private player: Player

  constructor(player: Player, model: IModel.Probe) {
    super(player.map)
    this.player = player
    this.buildContainer()

    this.setCoord(model.pos)
  }

  public size() {
    return Probe.SIZE
  }

  public setModel(model: IModel.ProbeState) {
    this.setCoord(model.pos)
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.player.color.hex())
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