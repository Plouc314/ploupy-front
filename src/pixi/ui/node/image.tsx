// types
import { IUI } from "../../../../types"

// pixi.js
import { Container, Texture, Sprite } from "pixi.js"

// pixi
import Context from "../../context"
import NodeUI, { NodeUIProps } from "./nodeui"

export interface ImageUIProps extends NodeUIProps {
  dim?: IUI.Dimension
  texture?: Texture
}

class ImageUI extends NodeUI {

  public dim: IUI.Dimension
  public texture: Texture

  private container: Sprite

  constructor(context: Context) {
    super(context)

    this.dim = { width: 10, height: 10 }
    this.texture = {} as Texture

    this.container = new Sprite()
  }

  public setProps(props: ImageUIProps) {
    super.setProps(props)
    if (props.dim) {
      if (props.dim.width !== undefined) {
        this.dim.width = props.dim.width
      }
      if (props.dim.height !== undefined) {
        this.dim.height = props.dim.height
      }
    }
    if (props.texture) {
      this.texture = props.texture
    }
  }

  public compile() {

    this.container.texture = this.texture
    this.container.width = this.dim.width
    this.container.height = this.dim.height

    this.compilePosition(this.container)
  }

  public child(): Container {
    return this.container
  }
}

export default ImageUI