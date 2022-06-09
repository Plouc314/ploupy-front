// pixijs
import { Container, Text, Graphics } from 'pixi.js'

// types
import { IGame } from '../../types'

// pixi
import Color from '../utils/color'
import Context from './context'
import Game from './game'
import ActionButton from './ui/actionbutton'
import TextUI from './ui/node/text'
import PlayerBar from './ui/playerbar'

interface UISizes {
  heightPlayerBar: number
  xButtons: number
  yButtons: number
}

class UI implements IGame.Sprite {

  public static readonly HEIGHT = 80

  public game: Game
  public context: Context

  public sizes: UISizes

  private container: Container
  private background: Graphics
  private playerBars: PlayerBar[]
  // private buttonFactory: ActionButton
  private errorText: TextUI

  private errorCounter: number

  constructor(game: Game, context: Context) {
    this.game = game
    this.context = context

    this.sizes = context.scaleUI({
      heightPlayerBar: 40,
      xButtons: context.config.dim.x * context.sizes.tile,
      yButtons: context.config.dim.y * context.sizes.tile - UI.HEIGHT,
    })

    this.errorCounter = 0

    this.container = new Container()
    this.background = new Graphics()
    this.background.beginFill(Color.fromRgb(20, 20, 20).hex())
    this.background.drawRect(0, 0, context.sizes.ui.width, context.sizes.ui.height)
    this.container.addChild(this.background)

    this.playerBars = []

    for (let i = 0; i < this.game.players.length; i++) {
      const player = this.game.players[i]
      const bar = new PlayerBar(this, player, context)
      bar.child().position.y = i * this.sizes.heightPlayerBar
      this.playerBars.push(bar)
      this.container.addChild(bar.child())
    }

    // this.buttonFactory = new ActionButton(this, context, "factory", "F")
    // this.buttonFactory.child().position.x = this.sizes.xButtons
    // this.buttonFactory.child().position.y = this.sizes.yButtons
    // this.container.addChild(this.buttonFactory.child())

    this.errorText = new TextUI(context)
    this.errorText.pos.x = context.sizes.ui.width - 20
    this.errorText.parent.height = this.sizes.heightPlayerBar
    this.errorText.centeredY = true
    this.errorText.anchorX = "right"
    this.errorText.color = Color.WHITE
    this.errorText.fontSize = 16
    this.errorText.compile()
    this.container.addChild(this.errorText.child())
  }

  public update(dt: number) {
    for (const playerBar of this.playerBars) {
      playerBar.update(dt)
    }
  }

  public setGameActionError(msg: string) {
    this.errorText.text = msg
    this.errorText.compile()

    this.errorCounter += 1
    const currentValue = this.errorCounter
    setTimeout(() => {
      if (currentValue == this.errorCounter) {
        this.errorText.text = ""
        this.errorText.compile()
      }
    }, 3000)
  }

  public child(): Container {
    return this.container
  }
}

export default UI