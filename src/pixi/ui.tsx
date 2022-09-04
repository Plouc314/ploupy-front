// pixijs
import { Container, Text, Graphics } from 'pixi.js'

// types
import { ICore, IGame } from '../../types'

// pixi
import Color from '../utils/color'
import { getTechIconName, getTechType, TECHS } from './constants'
import Context from './context'
import Game from './game'
import ActionButton from './ui/actionbutton'
import TextUI from './ui/node/text'
import PlayerBar from './ui/playerbar'

interface UISizes {
  heightPlayerBar: number
  marginYPlayerBar: number
  xActionsButtons: number
  xTechButtons: number
  yActionButtons: number
  yTechButtons: number
  marginButton: number
}

type UIButtons = "factory"
  | "turret"
  | "attack"
  | "explode"
  | IGame.TechIconName

const actionButtonsData: { name: UIButtons, key: string }[] = [
  { name: "turret", key: "T" },
  { name: "factory", key: "F" },
  { name: "explode", key: "X" },
  { name: "attack", key: "A" },
]

const techButtonsData: { name: UIButtons, x: number, y: number }[] = TECHS
  .map((name, i) => ({
    name: getTechIconName(name),
    x: i % 3,
    y: (i - i % 3) / 3,
  }))

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
      heightPlayerBar: 40,
      marginYPlayerBar: 5,
      xActionsButtons: 20,
      xTechButtons: 140,
      yActionButtons: this.context.sizes.dimMap.y - 100,
      yTechButtons: this.context.sizes.dimMap.y - 370,
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
      bar.child().position.y = i * (this.sizes.heightPlayerBar + this.sizes.marginYPlayerBar)
      this.playerBars.push(bar)
      this.container.addChild(bar.child())
    }

    actionButtonsData.forEach(({ name, key }, i) => {
      const btn = new ActionButton(
        this,
        this.context,
        name,
        { key, price: this.getActionPrice(name) }
      )
      btn.child().position.x = this.sizes.xActionsButtons
      btn.child().position.y = this.sizes.yActionButtons - i * (btn.sizes.dimY + this.sizes.marginButton)

      // check if previous version of button exists
      const oldButton = this.buttons[name]
      if (oldButton) {
        // keep button's external logic
        btn.onClick = oldButton.onClick
      }

      this.buttons[name] = btn

      // only display buttons in non-specator mode
      if (!this.game.isSpectator) {
        this.container.addChild(btn.child())
      }
    })

    techButtonsData.forEach(({ name, x, y }) => {
      const btn = new ActionButton(
        this,
        this.context,
        name,
        { price: this.getActionPrice(name) }
      )
      btn.child().position.x = this.sizes.xTechButtons + x * (btn.sizes.dimX + this.sizes.marginButton)
      btn.child().position.y = this.sizes.yTechButtons - y * (btn.sizes.dimY + this.sizes.marginButton)

      // check if previous version of button exists
      const oldButton = this.buttons[name]
      if (oldButton) {
        // keep button's external logic
        btn.onClick = oldButton.onClick
      }

      this.buttons[name] = btn

      // only display buttons in non-specator mode
      if (!this.game.isSpectator) {
        this.container.addChild(btn.child())
      }
    })

    this.errorText = new TextUI(this.context)
    this.errorText.pos.x = this.context.sizes.ui.width - 20
    this.errorText.parent.height = this.sizes.heightPlayerBar
    this.errorText.centeredY = true
    this.errorText.anchorX = "right"
    this.errorText.color = Color.WHITE
    this.errorText.fontSize = 16
    this.errorText.compile()

    // only display error text in non-specator mode
    if (!this.game.isSpectator) {
      this.container.addChild(this.errorText.child())
    }
  }

  public update(dt: number) {
    for (const playerBar of this.playerBars) {
      playerBar.update(dt)
    }

    const ownPlayer = this.game.ownPlayer
    if (!ownPlayer) return
    ownPlayer.techs.forEach(tech => {
      const techType = getTechType(tech)
      TECHS
        .filter(t => getTechType(t) === techType)
        .map(t => this.buttons[getTechIconName(t)])
        .forEach(btn => {
          btn.child().visible = false
        })
    })

  }

  /**
   * Executed when the context is updated,
   * for example: on resize of the canvas
   */
  public onContextUpdate() {
    this.build()
  }

  /**
   * Return the price of an action (0 if no price)
   */
  private getActionPrice(action: UIButtons) {
    if (action === "attack" || action === "explode") {
      return "-"
    }
    if (action === "factory") {
      return this.context.config.factory_price + ""
    }
    if (action === "turret") {
      return this.context.config.turret_price + ""
    }
    const key = action + "_price" as keyof ICore.GameConfig
    return this.context.config[key] as number + ""
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