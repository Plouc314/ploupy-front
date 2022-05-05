// types
import { Game } from '../../types'

// pixi.js
import { Graphics, Container, Sprite } from 'pixi.js';

// pixi
import Keyboard from './keyboard';
import Frame from './frame';
import Color from './color';
import Tile from './tile';

class Player implements Game.Sprite {

  public static readonly SPEED = 10
  public static readonly DEFAULT_COLOR: Game.RGB = { r: 220, g: 100, b: 100 }
  private sprite: Container
  private color: Color

  constructor() {
    this.color = Color.fromRgb(Player.DEFAULT_COLOR)
    this.sprite = this.buildSprite()
  }

  private buildSprite(): Container {
    const sprite = new Graphics()
    sprite.beginFill(this.color.hex())
    sprite.drawRect(10, 10, 80, 80)
    return sprite
  }

  public update() {
    if (Keyboard.get("a").down) {
      this.sprite.position.x += -Player.SPEED * Frame.dt
    }
    if (Keyboard.get("d").down) {
      this.sprite.position.x += Player.SPEED * Frame.dt
    }
    if (Keyboard.get("w").down) {
      this.sprite.position.y += -Player.SPEED * Frame.dt
    }
    if (Keyboard.get("s").down) {
      this.sprite.position.y += Player.SPEED * Frame.dt
    }
  }

  public pos(): Game.Position {
    return {
      x: this.sprite.position.x + 50,
      y: this.sprite.position.y + 50,
    }
  }

  public child(): Container {
    return this.sprite
  }
}

export default Player