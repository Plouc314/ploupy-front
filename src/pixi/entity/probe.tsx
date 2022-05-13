// types
import { IGame } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'


class Probe extends Entity {

  public static readonly SIZE = 20

  private player: Player

  constructor(player: Player, coord: IGame.Coordinate) {
    super(player.map)
    this.player = player
    this.setCoord(coord)
  }

  public size() {
    return Probe.SIZE
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.player.color.hex())
    surf.drawRect(15, 15, 20, 20)
    this.container.addChild(surf)
  }
}

export default Probe