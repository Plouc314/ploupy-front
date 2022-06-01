// types
import { IGame, IUI } from "../../../../types"

// pixi.js
import { Container } from "pixi.js"

// pixi
import Context from "../../context"


export interface NodeUISizes {
  marginX: number
  marginY: number
}

export interface NodeUIProps {
  anchorX?: IUI.AlignX
  anchorY?: IUI.AlignY
  centeredX?: boolean
  centeredY?: boolean
  pos?: Partial<IGame.Point2D>
  parent?: Partial<IUI.Dimension>
}

abstract class NodeUI implements IGame.Sprite {

  public context: Context
  public sizes: NodeUISizes

  // properties that define the node
  public anchorX: IUI.AlignX
  public anchorY: IUI.AlignY
  public centeredX: boolean
  public centeredY: boolean
  /** position of the node (independently of the anchors) */
  public pos: IGame.Point2D
  /** dimension of the parent that contains this, used for centering */
  public parent: IUI.Dimension

  constructor(context: Context) {
    this.context = context

    this.sizes = context.scaleUI(this.defaultSizes())

    this.anchorX = "left"
    this.anchorY = "top"
    this.centeredX = false
    this.centeredY = false
    this.pos = {
      x: this.sizes.marginX,
      y: this.sizes.marginY
    }
    this.parent = {
      width: 0,
      height: 0,
    }
  }

  /**
   * Used in NodeUI constructor to initialize `pos`
   */
  protected defaultSizes(): NodeUISizes {
    return {
      marginX: 5,
      marginY: 5,
    }
  }

  /**
   * Update the position of the node, given its container.
   * Take account of the anchors, centering
   */
  protected compilePosition(container: Container) {
    let { x, y } = this.pos

    if (this.centeredX && this.parent.width > 0) {
      x = (this.parent.width - container.width) / 2
    } else if (this.anchorX == "right") {
      x -= container.width
    }

    if (this.centeredY && this.parent.height > 0) {
      y = (this.parent.height - container.height) / 2
    } else if (this.anchorY == "bottom") {
      y -= container.height
    }

    container.position.x = x
    container.position.y = y
  }

  /**
   * Set the properties of the node
   * equivalent to manualy setting each property
   */
  public setProps(props: NodeUIProps) {
    if (props.anchorX) {
      this.anchorX = props.anchorX
    }
    if (props.anchorY) {
      this.anchorY = props.anchorY
    }
    if (props.centeredX !== undefined) {
      this.centeredX = props.centeredX
    }
    if (props.centeredY !== undefined) {
      this.centeredY = props.centeredY
    }
    if (props.pos) {
      if (props.pos.x !== undefined) {
        this.pos.x = props.pos.x
      }
      if (props.pos.y !== undefined) {
        this.pos.y = props.pos.y
      }
    }
    if (props.parent) {
      if (props.parent.width !== undefined) {
        this.parent.width = props.parent.width
      }
      if (props.parent.height !== undefined) {
        this.parent.height = props.parent.height
      }
    }
  }

  /**
   * Update all properties of the node
   */
  public abstract compile(): void

  public update(dt: number) { }

  public abstract child(): Container
}

export default NodeUI