// types
import { IGame, IUI } from "../../../../types"

// pixi.js
import { Graphics, Container } from "pixi.js"

// pixi
import Context from "../../context"
import Color from "../../../utils/color"
import NodeUI from "./nodeui"

class UniformUI extends NodeUI {

  public dim: IUI.Dimension
  public color: Color
  public marginWidth: number
  public marginColor: Color

  private container: Graphics

  constructor(context: Context) {
    super(context)

    this.dim = { width: 10, height: 10 }
    this.color = Color.BLACK
    this.marginWidth = 0
    this.marginColor = Color.BLACK

    this.container = new Graphics()
  }

  public compile() {

    this.container.beginFill(this.color.hex())
    this.container.drawRect(0, 0, this.dim.width, this.dim.height)

    if (this.marginWidth > 0) {
      this.container.lineStyle(this.marginWidth, this.marginColor.hex())
        .moveTo(0, 0)
        .lineTo(0, this.dim.height)
        .lineTo(this.dim.width, this.dim.height)
        .lineTo(this.dim.width, 0)
        .lineTo(0, 0)
    }

    this.compilePosition(this.container)
  }

  public child(): Container {
    return this.container
  }
}

export default UniformUI