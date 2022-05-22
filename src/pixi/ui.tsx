// pixijs
import { Container, Text, Graphics } from 'pixi.js'

// types
import { IGame } from '../../types'

// pixi
import Color from '../utils/color'
import Game from './game'

class UI implements IGame.Sprite {
  public static readonly SCORE_WIDTH = 100

  public game: Game

  private container: Container
  private bg: Graphics
  private scores: Text[]

  constructor(game: Game, width: number) {
    this.game = game

    this.container = new Container()
    this.bg = new Graphics()
    this.bg.beginFill(Color.fromRgb(255, 255, 255).hex())
    this.bg.drawRect(0, 0, width, 50)
    this.container.addChild(this.bg)

    this.scores = []
    for (let i = 0; i < this.game.players.length; i++) {
      const text = new Text("")
      text.position.x = i * UI.SCORE_WIDTH
      this.container.addChild(text)
      this.scores.push(text)
    }
  }

  public update(dt: number) {
    for (let i = 0; i < this.game.players.length; i++) {
      const player = this.game.players[i]
      const text = this.scores[i]
      text.style.fill = player.color.withDiff(-60).hex()
      text.text = `${player.username}`
    }
  }

  public child(): Container {
    return this.container
  }
}

export default UI