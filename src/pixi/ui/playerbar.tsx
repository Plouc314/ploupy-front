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

interface PlayerBarSizes {
  xColor: number
  color: number
  xUsername: number
  xTitleMoney: number
  xValueMoney: number
  xTitleFactories: number
  xValueFactories: number
  xTitleProbes: number
  xValueProbes: number
}

class PlayerBar implements IGame.Sprite {

  public ui: UI
  public player: Player
  public context: Context

  public sizes: PlayerBarSizes

  private container: Container
  private color: UniformUI
  private username: TextUI
  private titleMoney: TextUI
  private valueMoney: TextUI
  private titleFactories: TextUI
  private valueFactories: TextUI
  private titleProbes: TextUI
  private valueProbes: TextUI


  constructor(ui: UI, player: Player, context: Context) {
    this.ui = ui
    this.player = player
    this.context = context

    this.sizes = context.scaleUI({
      xColor: 10,
      color: 30,
      xUsername: 60,
      xTitleMoney: 150,
      xValueMoney: 250,
      xTitleFactories: 300,
      xValueFactories: 400,
      xTitleProbes: 450,
      xValueProbes: 550,
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

    this.titleMoney = new TextUI(context)
    this.titleMoney.setProps(propsCenter)
    this.titleMoney.setProps(propsText)
    this.titleMoney.text = "Money:"
    this.titleMoney.pos.x = this.sizes.xTitleMoney
    this.titleMoney.compile()

    this.valueMoney = new TextUI(context)
    this.valueMoney.setProps(propsCenter)
    this.valueMoney.setProps(propsText)
    this.valueMoney.anchorX = "right"
    this.valueMoney.pos.x = this.sizes.xValueMoney
    this.valueMoney.compile()

    this.titleFactories = new TextUI(context)
    this.titleFactories.setProps(propsCenter)
    this.titleFactories.setProps(propsText)
    this.titleFactories.text = "Factories:"
    this.titleFactories.pos.x = this.sizes.xTitleFactories
    this.titleFactories.compile()

    this.valueFactories = new TextUI(context)
    this.valueFactories.setProps(propsCenter)
    this.valueFactories.setProps(propsText)
    this.valueFactories.anchorX = "right"
    this.valueFactories.pos.x = this.sizes.xValueFactories
    this.valueFactories.compile()

    this.titleProbes = new TextUI(context)
    this.titleProbes.setProps(propsCenter)
    this.titleProbes.setProps(propsText)
    this.titleProbes.text = "Probes:"
    this.titleProbes.pos.x = this.sizes.xTitleProbes
    this.titleProbes.compile()

    this.valueProbes = new TextUI(context)
    this.valueProbes.setProps(propsCenter)
    this.valueProbes.setProps(propsText)
    this.valueProbes.anchorX = "right"
    this.valueProbes.pos.x = this.sizes.xValueProbes
    this.valueProbes.compile()

    this.container.addChild(this.color.child())
    this.container.addChild(this.username.child())
    this.container.addChild(this.titleMoney.child())
    this.container.addChild(this.valueMoney.child())
    this.container.addChild(this.titleFactories.child())
    this.container.addChild(this.valueFactories.child())
    this.container.addChild(this.titleProbes.child())
    this.container.addChild(this.valueProbes.child())
  }

  public update(dt: number) {
    this.valueFactories.text = this.player.factories.length.toString()
    this.valueFactories.compile()
    this.valueProbes.text = this.player.probes.length.toString()
    this.valueProbes.compile()
    this.valueMoney.text = this.player.money.toString()
    this.valueMoney.compile()
  }

  public child(): Container {
    return this.container
  }
}

export default PlayerBar