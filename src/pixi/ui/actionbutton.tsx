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
  yIcon: number
  yKey: number
}


class ActionButton implements IGame.Sprite {
  public static readonly BUTTON_COLOR = Color.fromRgb(150, 150, 150)

  public ui: UI
  public textures: Textures
  public context: Context

  public sizes: ActionButtonSizes

  private container: Container
  private background: UniformUI
  private icon: ImageUI
  private key: TextUI

  constructor(ui: UI, context: Context, icon: string, key: string) {
    this.ui = ui
    this.textures = ui.game.pixi.textures
    this.context = context

    this.sizes = context.scaleUI({
      dimX: 80,
      dimY: 80,
      sizeIcon: 40,
      yIcon: 15,
      yKey: 55,
    })

    this.container = new Container()

    this.background = new UniformUI(context)
    this.background.pos = { x: 0, y: 0 }
    this.background.dim.width = this.sizes.dimX
    this.background.dim.height = this.sizes.dimY
    this.background.color = ActionButton.BUTTON_COLOR
    this.background.compile()

    this.icon = new ImageUI(context)
    this.icon.texture = this.textures.getIcon(icon, Color.WHITE)
    this.icon.parent.width = this.sizes.dimX
    this.icon.centeredX = true
    this.icon.dim.width = this.sizes.sizeIcon
    this.icon.dim.height = this.sizes.sizeIcon
    this.icon.pos.y = this.sizes.yIcon
    this.icon.compile()

    this.key = new TextUI(context)
    this.key.parent.width = this.sizes.dimX
    this.key.centeredX = true
    this.key.pos.y = this.sizes.yKey
    this.key.color = Color.WHITE
    this.key.fontSize = 18
    this.key.text = key
    this.key.compile()

    this.container.addChild(this.background.child())
    this.container.addChild(this.icon.child())
    this.container.addChild(this.key.child())
  }

  public update(dt: number) {

  }

  public child(): Container {
    return this.container
  }
}

export default ActionButton