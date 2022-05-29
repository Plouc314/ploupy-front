// types
import { IGame, IModel } from '../../../types'

// pixi.js
import { Graphics, Container } from 'pixi.js'

// pixi
import Player from '../player'
import Entity from './entity'
import Tile from './tile'


class Factory extends Entity {

  public static readonly SIZE = 0.75

  public alive: boolean
  private player: Player

  constructor(player: Player, model: IModel.Factory) {
    super(model.id, player.context)
    this.player = player
    this.buildContainer()

    this.alive = model.alive
    this.setCoord(model.coord)
  }

  public setModel(model: IModel.FactoryState) {
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
    surf.beginFill(this.player.color.withDiff(-40).hex())

    const sizes = this.context.sizes()
    const margin = (sizes.tile - sizes.factory) / 2

    surf.drawRect(
      margin,
      margin,
      sizes.factory,
      sizes.factory,
    )
    this.container.addChild(surf)
  }
}

export default Factory