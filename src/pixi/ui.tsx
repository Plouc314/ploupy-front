// pixijs
import { Container, Text, Graphics } from 'pixi.js'

// types
import { IGame } from '../../types'

// pixi
import Color from '../utils/color'
import Game from './game'
import Interactions from './interactions'

class UI implements IGame.Sprite {
  public static readonly HEIGHT = 50
  public static readonly SCORE_WIDTH = 140

  public game: Game

  private container: Container
  private bg: Graphics
  private scores: Text[]
  private state: Text

  constructor(game: Game, width: number) {
    this.game = game

    this.container = new Container()
    this.bg = new Graphics()
    this.bg.beginFill(Color.fromRgb(20, 20, 20).hex())
    this.bg.drawRect(0, 0, width, 50)
    this.container.addChild(this.bg)

    this.scores = []
    for (let i = 0; i < this.game.players.length; i++) {
      const player = this.game.players[i]
      const text = new Text("")
      text.style.fill = player.color.withDiff(60).hex()
      text.position.x = i * UI.SCORE_WIDTH
      this.container.addChild(text)
      this.scores.push(text)
    }

    this.state = new Text("")
    this.state.style.fill = Color.fromRgb(255, 255, 255).hex()
    this.state.position.x = this.game.context.sizes().dim.x - 100
    this.container.addChild(this.state)
  }

  public update(dt: number) {
    for (let i = 0; i < this.game.players.length; i++) {
      const player = this.game.players[i]
      const text = this.scores[i]
      text.text = `${player.username}: ${player.money}`
    }
    this.state.text = this.game.interactions.getState()
  }

  public child(): Container {
    return this.container
  }
}

export default UI