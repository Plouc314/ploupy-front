// types
import { Game } from '../../types'

// pixi.js
import { Graphics, Container, Sprite } from 'pixi.js';

// pixi
import Keyboard from './keyboard';
import Frame from './frame';
import Color from './color';
import GameLogic from './gamelogic';

class Player implements Game.Sprite {

  public static readonly SIZE = 50
  public static readonly SPEED = 10
  public static readonly ATTACK_DELAY = 80
  public static readonly ATTACK_SCOPE = 8

  private container: Container
  private delayBar: Graphics

  public color: Color
  private attackDelay: number
  public dir: Game.Direction
  public score: number

  constructor(color: Color) {
    this.color = color
    this.delayBar = new Graphics()
    this.container = this.buildContainer()
    this.attackDelay = 0
    this.score = 0
    this.dir = { x: 0, y: 0 }
  }

  private buildContainer(): Container {
    const container = new Container()
    const surf = new Graphics()
    surf.beginFill(this.color.hex())
    surf.drawRect(5, 5, 40, 40)
    container.addChild(surf)
    container.addChild(this.delayBar)
    return container
  }

  private buildDelayBar() {
    this.delayBar.clear()
    this.delayBar.beginFill(this.barDelayColor().hex())
    this.delayBar.drawRect(40, 5, 5, 40 * this.attackDelay / Player.ATTACK_DELAY)
  }

  public update() {
    // movement
    let isMov = false
    if (Keyboard.get("a").down) {
      this.dir = { x: -1, y: 0 }
      isMov = true
    }
    if (Keyboard.get("d").down) {
      this.dir = { x: 1, y: 0 }
      isMov = true
    }
    if (Keyboard.get("w").down) {
      this.dir = { x: 0, y: -1 }
      isMov = true
    }
    if (Keyboard.get("s").down) {
      this.dir = { x: 0, y: 1 }
      isMov = true
    }
    if (isMov) {
      this.container.position.x += this.dir.x * Player.SPEED * Frame.dt
      this.container.position.y += this.dir.y * Player.SPEED * Frame.dt
    }
    // check current tile
    const map = GameLogic.map
    map.claimTile(this, map.coord(this.pos()))

    // update attack
    this.attackDelay = Math.max(this.attackDelay - Frame.dt, 0)

    if (Keyboard.get("p").down) {
      if (this.attackDelay == 0) {
        this.attack()
        this.attackDelay = Player.ATTACK_DELAY
      }
    }

    // update delay bar
    this.buildDelayBar()
  }

  private attack() {
    const map = GameLogic.map
    const coord = map.coord(this.pos())
    for (let i = 1; i < Player.ATTACK_SCOPE; i++) {
      map.claimTile(this, {
        x: coord.x + this.dir.x * i,
        y: coord.y + this.dir.y * i
      })
    }
  }

  public pos(): Game.Position {
    return {
      x: this.container.position.x + Player.SIZE / 2,
      y: this.container.position.y + Player.SIZE / 2,
    }
  }

  public tileColor(): Color {
    return this.color.withDiff(-20, -20, -20)
  }

  public barDelayColor(): Color {
    return this.color.withDiff(-60, -60, -60)
  }

  public textColor(): Color {
    return this.color.withDiff(-100, -100, -100)
  }

  public child(): Container {
    return this.container
  }
}

export default Player