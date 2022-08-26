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

interface ActionButtonSizes {
  dimX: number
  dimY: number
  sizeIcon: number
  xIcon: number
  xKey: number
  yKey: number
  xPrice: number
  yPrice: number
  marginWidth: number
}


class ActionButton implements IGame.Sprite {
  public static readonly BUTTON_COLOR = Color.fromRgb(60, 60, 60)
  public static readonly MARGIN_COLOR = Color.fromRgb(100, 100, 100)

  public ui: UI
  public textures: Textures
  public context: Context

  public sizes: ActionButtonSizes

  private container: Container
  private background: UniformUI
  private icon: ImageUI
  private price?: TextUI
  private key?: TextUI

  public onClick: () => void

  private isHover: boolean

  constructor(ui: UI, context: Context, icon: string, options?: { key?: string, price?: string }) {
    this.ui = ui
    this.textures = ui.game.pixi.textures
    this.context = context

    this.sizes = context.scaleUI({
      dimX: 70,
      dimY: 70,
      sizeIcon: 35,
      xIcon: 20,
      xKey: 5,
      yKey: 5,
      xPrice: 5,
      yPrice: 68,
      marginWidth: 3,
    })

    this.onClick = () => { }
    this.isHover = false

    this.container = new Container()

    this.setupInteractions()

    this.background = new UniformUI(context)
    this.background.pos = { x: 0, y: 0 }
    this.background.dim.width = this.sizes.dimX
    this.background.dim.height = this.sizes.dimY
    this.background.color = ActionButton.BUTTON_COLOR
    this.background.marginWidth = this.sizes.marginWidth
    this.background.marginColor = ActionButton.MARGIN_COLOR
    this.background.compile()

    this.icon = new ImageUI(context)
    this.icon.texture = this.textures.getIcon(icon, Color.WHITE)
    this.icon.parent.height = this.sizes.dimY
    this.icon.centeredY = true
    this.icon.dim.width = this.sizes.sizeIcon
    this.icon.dim.height = this.sizes.sizeIcon
    this.icon.pos.x = this.sizes.xIcon
    this.icon.compile()

    this.container.addChild(this.background.child())
    this.container.addChild(this.icon.child())

    if (options?.key !== undefined) {
      this.key = new TextUI(context)
      this.key.pos.x = this.sizes.xKey
      this.key.pos.y = this.sizes.yKey
      this.key.color = Color.WHITE
      this.key.fontSize = 18
      this.key.fontWeight = "bold"
      this.key.text = options.key
      this.key.compile()
      this.container.addChild(this.key.child())
    }

    if (options?.price !== undefined) {
      this.price = new TextUI(context)
      this.price.pos.x = this.sizes.xPrice
      this.price.pos.y = this.sizes.yPrice
      this.price.anchorY = "bottom"
      this.price.color = Color.WHITE
      this.price.fontSize = 14
      this.price.text = options.price
      this.price.compile()
      this.container.addChild(this.price.child())
    }
  }

  private setupInteractions() {
    this.container.interactive = true
    this.container.buttonMode = true

    this.container.on("pointerover", () => {
      this.isHover = true
      this.background.color = ActionButton.BUTTON_COLOR.withDiff(40)
      this.background.marginColor = ActionButton.MARGIN_COLOR.withDiff(-30)
      this.background.compile()
    })
    this.container.on("pointerout", () => {
      this.isHover = false
      this.background.color = ActionButton.BUTTON_COLOR
      this.background.marginColor = ActionButton.MARGIN_COLOR
      this.background.compile()
    })
    this.container.on("pointerdown", () => {
      this.background.color = ActionButton.BUTTON_COLOR.withDiff(80)
      this.background.marginColor = ActionButton.MARGIN_COLOR.withDiff(-50)
      this.background.compile()
    })
    this.container.on("pointerup", () => {
      this.background.color = ActionButton.BUTTON_COLOR.withDiff(40)
      this.background.marginColor = ActionButton.MARGIN_COLOR.withDiff(-30)
      this.background.compile()
      this.onClick()
    })
  }

  /**
   * Programmatically click the button
   * Add visual click effect
   */
  public click() {
    this.onClick()

    // effect
    this.background.color = ActionButton.BUTTON_COLOR.withDiff(80)
    this.background.marginColor = ActionButton.MARGIN_COLOR.withDiff(-50)
    this.background.compile()
    setTimeout(() => {
      this.background.color = ActionButton.BUTTON_COLOR
      this.background.marginColor = ActionButton.MARGIN_COLOR
      this.background.compile()
    }, 150)
  }

  public update(dt: number) {

  }

  public child(): Container {
    return this.container
  }
}

export default ActionButton