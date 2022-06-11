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
  marginButton: number
}

type UIButtons = "factory" | "turret" | "attack" | "explode"

const buttonsData: { name: UIButtons, key: string }[] = [
  { name: "turret", key: "T" },
  { name: "factory", key: "F" },
  { name: "explode", key: "X" },
  { name: "attack", key: "A" },
]

class UI implements IGame.Sprite {

  public game: Game
  public context: Context

  public sizes: UISizes

  private container: Container
  private background: Graphics
  private playerBars: PlayerBar[]
  private errorText: TextUI

  public buttons: Record<UIButtons, ActionButton>

  private errorCounter: number

  constructor(game: Game, context: Context) {
    this.game = game
    this.context = context
    this.errorCounter = 0

    this.sizes = {} as UISizes
    this.container = new Container()
    this.background = {} as Graphics
    this.playerBars = []
    this.buttons = {} as any
    this.errorText = {} as TextUI

    this.build()
  }

  private build() {
    this.sizes = this.context.scaleUI({
      heightPlayerBar: 30,
      xButtons: 20,
      yButtons: this.context.sizes.dimMap.y - 100,
      marginButton: 20,
    })

    this.container.removeChildren()
    this.container.position.x = this.context.sizes.ui.x

    this.background = new Graphics()
    this.background.beginFill(Color.fromRgb(20, 20, 20).hex())
    this.background.drawRect(0, 0, this.context.sizes.ui.width, this.context.sizes.ui.height)
    this.container.addChild(this.background)

    this.playerBars = []

    for (let i = 0; i < this.game.players.length; i++) {
      const player = this.game.players[i]
      const bar = new PlayerBar(this, player, this.context)
      bar.child().position.y = i * this.sizes.heightPlayerBar
      this.playerBars.push(bar)
      this.container.addChild(bar.child())
    }

    buttonsData.forEach(({ name, key }, i) => {
      const btn = new ActionButton(this, this.context, name, key)
      btn.child().position.x = this.sizes.xButtons
      btn.child().position.y = this.sizes.yButtons - i * (btn.sizes.dimY + this.sizes.marginButton)
      this.buttons[name] = btn
      this.container.addChild(btn.child())
    })

    this.errorText = new TextUI(this.context)
    this.errorText.pos.x = this.context.sizes.ui.width - 20
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

  /**
   * Executed when the context is updated,
   * for example: on resize of the canvas
   */
  public onContextUpdate() {
    this.build()
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