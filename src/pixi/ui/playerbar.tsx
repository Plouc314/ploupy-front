// types
import { IGame } from "../../../types"

// pixi.js
import { Container, Graphics } from "pixi.js"

// pixi
import Player from "../player"
import Context from "../context"
import TextUI from "./node/text"
import Color from "../../utils/color"
import UI from "../ui"
import UniformUI from "./node/uniform"
import ImageUI from "./node/image"
import Textures from "../textures"

interface PlayerBarSizes {
  xColor: number
  color: number
  icon: number
  xUsername: number
  xIconMoney: number
  xValueMoney: number
  xIconFactories: number
  xValueFactories: number
  xIconTurrets: number
  xValueTurrets: number
  xIconProbes: number
  xValueProbes: number
}

class PlayerBar implements IGame.Sprite {

  public ui: UI
  public textures: Textures
  public player: Player
  public context: Context

  /**keep trak of player alive attribute */
  public alive: boolean

  public sizes: PlayerBarSizes

  private container: Container
  private color: UniformUI
  private username: TextUI
  private iconMoney: ImageUI
  private valueMoney: TextUI
  private iconFactories: ImageUI
  private valueFactories: TextUI
  private iconTurrets: ImageUI
  private valueTurrets: TextUI
  private iconProbes: ImageUI
  private valueProbes: TextUI

  constructor(ui: UI, player: Player, context: Context) {
    this.ui = ui
    this.textures = ui.game.pixi.textures
    this.player = player
    this.alive = player.alive
    this.context = context

    this.sizes = context.scaleUI({
      xColor: 10,
      color: 30,
      icon: 22,
      xUsername: 60,
      xIconMoney: 150,
      xValueMoney: 210,
      xIconFactories: 260,
      xValueFactories: 320,
      xIconTurrets: 370,
      xValueTurrets: 430,
      xIconProbes: 480,
      xValueProbes: 540,
    })

    this.container = new Container()

    const propsCenter = {
      parent: { height: this.ui.sizes.heightPlayerBar },
      centeredY: true,
    }

    const propsIcon = {
      dim: {
        width: this.sizes.icon,
        height: this.sizes.icon,
      }
    }

    const propsText = {
      color: Color.WHITE,
      fontSize: 16,
    }

    this.color = new UniformUI(context)
    this.color.dim.width = this.sizes.color
    this.color.dim.height = this.sizes.color
    this.color.setProps(propsCenter)
    this.color.color = this.player.color
    this.color.compile()

    this.username = new TextUI(context)
    this.username.setProps(propsCenter)
    this.username.setProps(propsText)
    this.username.text = player.username
    this.username.pos.x = this.sizes.xUsername
    this.username.compile()

    this.iconMoney = new ImageUI(context)
    this.iconMoney.texture = this.textures.getIcon("money", Color.WHITE)
    this.iconMoney.setProps(propsIcon)
    this.iconMoney.setProps(propsCenter)
    this.iconMoney.pos.x = this.sizes.xIconMoney
    this.iconMoney.compile()

    this.valueMoney = new TextUI(context)
    this.valueMoney.setProps(propsCenter)
    this.valueMoney.setProps(propsText)
    this.valueMoney.anchorX = "right"
    this.valueMoney.pos.x = this.sizes.xValueMoney
    this.valueMoney.compile()

    this.iconFactories = new ImageUI(context)
    this.iconFactories.texture = this.textures.getIcon("factory", Color.WHITE)
    this.iconFactories.setProps(propsIcon)
    this.iconFactories.setProps(propsCenter)
    this.iconFactories.pos.x = this.sizes.xIconFactories
    this.iconFactories.compile()

    this.valueFactories = new TextUI(context)
    this.valueFactories.setProps(propsCenter)
    this.valueFactories.setProps(propsText)
    this.valueFactories.anchorX = "right"
    this.valueFactories.pos.x = this.sizes.xValueFactories
    this.valueFactories.compile()

    this.iconTurrets = new ImageUI(context)
    this.iconTurrets.texture = this.textures.getIcon("turret", Color.WHITE)
    this.iconTurrets.setProps(propsIcon)
    this.iconTurrets.setProps(propsCenter)
    this.iconTurrets.pos.x = this.sizes.xIconTurrets
    this.iconTurrets.compile()

    this.valueTurrets = new TextUI(context)
    this.valueTurrets.setProps(propsCenter)
    this.valueTurrets.setProps(propsText)
    this.valueTurrets.anchorX = "right"
    this.valueTurrets.pos.x = this.sizes.xValueTurrets
    this.valueTurrets.compile()

    this.iconProbes = new ImageUI(context)
    this.iconProbes.texture = this.textures.getIcon("probe", Color.WHITE)
    this.iconProbes.setProps(propsIcon)
    this.iconProbes.setProps(propsCenter)
    this.iconProbes.pos.x = this.sizes.xIconProbes
    this.iconProbes.compile()

    this.valueProbes = new TextUI(context)
    this.valueProbes.setProps(propsCenter)
    this.valueProbes.setProps(propsText)
    this.valueProbes.anchorX = "right"
    this.valueProbes.pos.x = this.sizes.xValueProbes
    this.valueProbes.compile()

    this.container.addChild(this.color.child())
    this.container.addChild(this.username.child())
    this.container.addChild(this.iconMoney.child())
    this.container.addChild(this.valueMoney.child())
    this.container.addChild(this.iconFactories.child())
    this.container.addChild(this.valueFactories.child())
    this.container.addChild(this.iconTurrets.child())
    this.container.addChild(this.valueTurrets.child())
    this.container.addChild(this.iconProbes.child())
    this.container.addChild(this.valueProbes.child())
  }

  public update(dt: number) {
    this.valueFactories.text = this.player.factories.length.toString()
    this.valueFactories.compile()
    this.valueTurrets.text = this.player.turrets.length.toString()
    this.valueTurrets.compile()
    this.valueProbes.text = this.player.probes.length.toString()
    this.valueProbes.compile()
    this.valueMoney.text = this.player.money.toString()
    this.valueMoney.compile()

    if (this.alive != this.player.alive) {
      this.alive = this.player.alive
      const color = Color.fromRgb(150, 150, 150)
      this.username.color = color
      this.valueMoney.color = color
      this.valueFactories.color = color
      this.valueTurrets.color = color
      this.valueProbes.color = color
      this.username.compile()
      this.valueMoney.compile()
      this.valueFactories.compile()
      this.valueTurrets.compile()
      this.valueProbes.compile()
    }

  }

  public child(): Container {
    return this.container
  }
}

export default PlayerBar