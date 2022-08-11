// types
import { IGame } from '../../../types'

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

  constructor(player: Player, model: IGame.FactoryState) {
    super(model.id, player.context)

    if (!this.assertCompleteModel(model)) {
      throw new Error("Incomplete model: " + model)
    }

    this.player = player
    this.buildContainer()

    this.alive = !model.death
    this.setCoord(model.coord)
  }

  private assertCompleteModel(model: IGame.FactoryState): model is IGame.Factory {
    if (model.coord === null) return false
    return true
  }

  public setModel(model: IGame.FactoryState) {
    if (model.coord) {
      this.setCoord(model.coord)
    }
    this.alive = !model.death ?? this.alive
  }

  protected buildContainer() {
    this.container.removeChildren()
    const surf = new Graphics()
    surf.beginFill(this.player.color.withSharpen(60).withDiff(-60).hex())

    const sizes = this.context.sizes
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