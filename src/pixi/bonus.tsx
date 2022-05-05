// pixijs
import { Container, Text, Graphics } from 'pixi.js'

// types
import { Game } from "../../types";

// pixi
import Player from './player';
import Tile from './tile';
import Color from './color';
import Frame from './frame';
import GameLogic from './gamelogic';


export class Bonus implements Game.Sprite {

  public static readonly SIZE = 50
  public static readonly EFFECT_SCOPE = 6

  private container: Graphics
  public coord: Game.Coordinate

  constructor(coord: Game.Coordinate) {
    this.coord = coord
    this.container = new Graphics()
    this.container.beginFill(Color.fromRgb(100, 100, 200).hex())
    this.container.drawCircle(Bonus.SIZE / 2, Bonus.SIZE / 2, Bonus.SIZE / 2)
    this.container.position.x = coord.x * Tile.SIZE
    this.container.position.y = coord.y * Tile.SIZE
  }

  public effect(player: Player) {
    const map = GameLogic.map
    const coord = map.coord(player.pos())
    for (let x = 1; x < Bonus.EFFECT_SCOPE; x++) {
      for (let y = 1; y < Bonus.EFFECT_SCOPE; y++) {
        map.claimTile(player, {
          x: coord.x + x - Bonus.EFFECT_SCOPE / 2,
          y: coord.y + y - Bonus.EFFECT_SCOPE / 2
        })
      }
    }
  }

  public child(): Container {
    return this.container
  }
}

class BonusSystem {

  public static readonly GENERATION_DELAY = 100
  private static container: Container

  public static bonuses: Bonus[]
  private static timer: number

  public static setup() {
    this.container = new Container()
    this.timer = this.GENERATION_DELAY
    this.bonuses = []
  }

  private static generateBonus() {
    const x = Math.round(Math.random() * GameLogic.dimension.x)
    const y = Math.round(Math.random() * GameLogic.dimension.y)
    for (const bonus of this.bonuses) {
      if (bonus.coord.x == x && bonus.coord.y == y) {
        this.generateBonus()
        return
      }
    }
    const bonus = new Bonus({ x, y })
    this.bonuses.push(bonus)
    this.container.addChild(bonus.child())
  }

  public static update(player: Player) {
    this.timer = Math.max(this.timer - Frame.dt, 0)
    if (this.timer == 0) {
      this.timer = this.GENERATION_DELAY
      this.generateBonus()
    }

    const { x, y } = GameLogic.map.coord(player.pos())

    const toRemove: Bonus[] = []
    for (const bonus of this.bonuses) {
      if (bonus.coord.x == x && bonus.coord.y == y) {
        bonus.effect(player)
        toRemove.push(bonus)
        this.container.removeChild(bonus.child())
      }
    }
    for (const bonus of toRemove) {
      const idx = this.bonuses.indexOf(bonus)
      this.bonuses.splice(idx, 1)
    }
  }

  public static child(): Container {
    return this.container
  }

}

export default BonusSystem