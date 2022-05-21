// types
import { IGame, IModel } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'


class Factory extends Entity {

  public static readonly SIZE = 50

  private player: Player

  constructor(player: Player, model: IModel.Factory) {
    super(player.map)
    this.player = player
    this.buildContainer()

    this.setCoord(model.coord)
  }

  public setModel(model: IModel.FactoryState) {
    this.setCoord(model.coord)
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