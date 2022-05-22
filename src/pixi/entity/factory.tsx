// types
import { IGame, IModel } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'
import Tile from './tile'


class Factory extends Entity {

  public static readonly SIZE = 30

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
    surf.drawRect(
      (Tile.SIZE - Factory.SIZE) / 2,
      (Tile.SIZE - Factory.SIZE) / 2,
      Factory.SIZE,
      Factory.SIZE,
    )
    this.container.addChild(surf)
  }
}

export default Factory