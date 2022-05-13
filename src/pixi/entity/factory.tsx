// types
import { IGame } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'


class Factory extends Entity {

  public static readonly SIZE = 50

  private player: Player

  constructor(player: Player, coord: IGame.Coordinate) {
    super(player.map)
    this.player = player
    this.setCoord(coord)
  }

  public size() {
    return Factory.SIZE
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.player.color.withDiff(-40).hex())
    surf.drawRect(5, 5, 40, 40)
    this.container.addChild(surf)
  }
}

export default Factory