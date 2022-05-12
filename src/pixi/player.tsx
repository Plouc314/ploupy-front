// types
import { IGame } from '../../types'

// pixi.js
import { Graphics, Container, Sprite } from 'pixi.js';

// pixi
import Keyboard from './keyboard';
import Color from './color';
import Tile from './tile';
import Map from './map';

class Player implements IGame.Sprite {

  public static readonly SIZE = 50
  public static readonly SPEED = 10
  public static readonly ATTACK_DELAY = 80
  public static readonly ATTACK_SCOPE = 8

  private container: Container
  private delayBar: Graphics

  public keyboard: Keyboard
  public map: Map

  public username: string
  public color: Color
  public attackDelay: number
  public dir: IGame.Direction
  public score: number
  public tiles: Tile[]

  constructor(username: string, color: Color, keyboard: Keyboard, map: Map) {
    this.username = username
    this.color = color

    this.keyboard = keyboard
    this.map = map

    this.delayBar = new Graphics()
    this.container = this.buildContainer()
    this.attackDelay = 0
    this.score = 0
    this.tiles = []
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

  public update(dt: number) {
    // movement
    let isMov = false
    if (this.keyboard.get("a").down) {
      this.dir = { x: -1, y: 0 }
      isMov = true
    }
    if (this.keyboard.get("d").down) {
      this.dir = { x: 1, y: 0 }
      isMov = true
    }
    if (this.keyboard.get("w").down) {
      this.dir = { x: 0, y: -1 }
      isMov = true
    }
    if (this.keyboard.get("s").down) {
      this.dir = { x: 0, y: 1 }
      isMov = true
    }
    if (isMov) {
      this.container.position.x += this.dir.x * Player.SPEED * dt
      this.container.position.y += this.dir.y * Player.SPEED * dt
    }

    // update attack
    this.attackDelay = Math.max(this.attackDelay - dt, 0)

    if (this.keyboard.get("p").down) {
      if (this.attackDelay == 0) {
        this.attack()
        this.attackDelay = Player.ATTACK_DELAY
      }
    }

    // update delay bar
    this.buildDelayBar()
  }

  private attack() {
    const coord = this.map.coord(this.pos())
    for (let i = 1; i < Player.ATTACK_SCOPE; i++) {
      // map.claimTile(this, {
      //   x: coord.x + this.dir.x * i,
      //   y: coord.y + this.dir.y * i
      // })
    }
  }

  public pos(): IGame.Position {
    return {
      x: this.container.position.x + Player.SIZE / 2,
      y: this.container.position.y + Player.SIZE / 2,
    }
  }

  public setPos(pos: IGame.Position) {
    this.container.position.x = pos.x - Player.SIZE / 2
    this.container.position.y = pos.y - Player.SIZE / 2
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