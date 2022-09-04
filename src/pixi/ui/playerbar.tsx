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
import { getTechIconName } from "../constants"

interface PlayerBarSizes {
  xColor: number
  color: number
  icon: number
  xUsername: number
  xIconMoney: number
  xValueMoney: number
  xValueIncome: number
  xIconFactories: number
  xValueFactories: number
  xIconTurrets: number
  xValueTurrets: number
  xIconProbes: number
  xValueProbes: number
  xIconTechs: number
  xIconsTech: number
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
  private valueIncome: TextUI
  private iconFactories: ImageUI
  private valueFactories: TextUI
  private iconTurrets: ImageUI
  private valueTurrets: TextUI
  private iconProbes: ImageUI
  private valueProbes: TextUI
  private iconTechs: ImageUI
  private iconsTech: ImageUI[]

  constructor(ui: UI, player: Player, context: Context) {
    this.ui = ui
    this.textures = ui.game.pixi.textures
    this.player = player
    this.alive = player.alive
    this.context = context

    this.sizes = context.scaleUI({
      xColor: 10,
      color: 20,
      icon: 20,
      xUsername: 40, // 35
      xIconMoney: 195, // 185
      xValueMoney: 250, // 240
      xValueIncome: 255, // 245
      xIconFactories: 315, // 185
      xValueFactories: 360, // 225
      xIconTurrets: 395, // 255
      xValueTurrets: 440, // 295
      xIconProbes: 475, // 325
      xValueProbes: 520, // 365
      xIconTechs: 555, // 300
      xIconsTech: 588, // 328
    })

    this.container = new Container()

    const propsCenter = {
      parent: { height: this.ui.sizes.heightPlayerBar },
      centeredY: true,
    }

    const propsText = {
      color: Color.WHITE,
      fontSize: 16,
    }

    this.iconsTech = []

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
    this.setIconProps(this.iconMoney)
    this.iconMoney.pos.x = this.sizes.xIconMoney
    this.iconMoney.compile()

    this.valueMoney = new TextUI(context)
    this.valueMoney.setProps(propsCenter)
    this.valueMoney.setProps(propsText)
    this.valueMoney.anchorX = "right"
    this.valueMoney.pos.x = this.sizes.xValueMoney
    this.valueMoney.compile()

    this.valueIncome = new TextUI(context)
    this.valueIncome.setProps(propsCenter)
    this.valueIncome.setProps(propsText)
    this.valueIncome.anchorX = "left"
    this.valueIncome.pos.x = this.sizes.xValueIncome
    this.valueIncome.compile()

    this.iconTechs = new ImageUI(context)
    this.iconTechs.texture = this.textures.getIcon("tech", Color.WHITE)
    this.setIconProps(this.iconTechs)
    this.iconTechs.pos.x = this.sizes.xIconTechs
    this.iconTechs.compile()

    this.iconFactories = new ImageUI(context)
    this.iconFactories.texture = this.textures.getIcon("factory", Color.WHITE)
    this.setIconProps(this.iconFactories)
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
    this.setIconProps(this.iconTurrets)
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
    this.setIconProps(this.iconProbes)
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
    this.container.addChild(this.valueIncome.child())
    this.container.addChild(this.iconTechs.child())
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
    this.valueMoney.text = `${this.player.money}`
    this.valueMoney.compile()

    let s = this.player.income > 0 ? "+" : ""
    this.valueIncome.text = `(${s}${this.player.income})`
    if (this.player.income > 0) {
      this.valueIncome.color = Color.fromRgb(100, 200, 100)
    } else if (this.player.income < 0) {
      this.valueIncome.color = Color.fromRgb(200, 100, 100)
    } else {
      this.valueIncome.color = Color.WHITE
    }
    this.valueIncome.compile()

    if (this.iconsTech.length < this.player.techs.length) {
      this.player.techs.forEach((tech, i) => {
        if (i < this.iconsTech.length) return
        const icon = new ImageUI(this.context)
        icon.texture = this.textures.getIcon(getTechIconName(tech), Color.WHITE)
        this.setIconProps(icon)
        icon.pos.x = this.sizes.xIconsTech + i * (this.sizes.icon + 4)
        icon.compile()
        this.iconsTech.push(icon)
        this.container.addChild(icon.child())
      })
    }

    if (this.alive != this.player.alive) {
      this.alive = this.player.alive
      const color = Color.fromRgb(150, 150, 150)
      this.username.color = color
      this.valueMoney.color = color
      this.valueIncome.color = color
      this.valueFactories.color = color
      this.valueTurrets.color = color
      this.valueProbes.color = color
      this.username.compile()
      this.valueMoney.compile()
      this.valueIncome.compile()
      this.valueFactories.compile()
      this.valueTurrets.compile()
      this.valueProbes.compile()
    }

  }

  private setIconProps(icon: ImageUI) {
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
    icon.setProps(propsIcon)
    icon.setProps(propsCenter)
  }

  public child(): Container {
    return this.container
  }
}

export default PlayerBar