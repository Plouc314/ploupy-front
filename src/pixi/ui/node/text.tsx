// types
import { IGame } from "../../../../types"

// pixi.js
import { Text, Container, TextStyleFontWeight } from "pixi.js"

// pixi
import Context from "../../context"
import Color from "../../../utils/color"
import NodeUI, { NodeUIProps } from "./nodeui"

export interface TextUIProps extends NodeUIProps {
  text?: string
  color?: Color
  fontSize?: number
  fontWeight?: TextStyleFontWeight
}

class TextUI extends NodeUI {

  public text: string
  public color: Color
  public fontSize: number
  public fontWeight: TextStyleFontWeight

  private container: Text

  constructor(context: Context) {
    super(context)

    this.text = ""
    this.color = Color.BLACK
    this.fontSize = 16
    this.fontWeight = "normal"

    this.container = new Text(this.text)
  }

  public setProps(props: TextUIProps) {
    super.setProps(props)
    if (props.text !== undefined) {
      this.text = props.text
    }
    if (props.color) {
      this.color = props.color
    }
    if (props.fontSize !== undefined) {
      this.fontSize = props.fontSize
    }
    if (props.fontWeight !== undefined) {
      this.fontWeight = props.fontWeight
    }
  }

  public compile() {

    // set style
    this.container.style.fill = this.color.hex()
    this.container.style.fontSize = this.fontSize
    this.container.style.fontWeight = this.fontWeight

    // set text
    this.container.text = this.text

    // set position
    this.compilePosition(this.container)
  }

  public child(): Container {
    return this.container
  }
}

export default TextUI