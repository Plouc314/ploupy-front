// types
import { IGame, IModel } from '../../types'

// pixi.js
import { Container, InteractionEvent } from 'pixi.js'

// pixi
import Tile from './entity/tile'
import Map from './map'
import Select from './gui/select'
import Keyboard from './keyboard'
import Player from './player'
import Probe, { ProbeState } from './entity/probe'
import Context from './context'

export enum InteractionState {
  IDLE = "IDLE",
  BUILD_FACTORY = "BUILD_FACTORY",
  SELECT_PROBES = "SELECT_PROBES",
}

class Interactions implements IGame.Sprite {

  public map: Map
  public context: Context
  public keyboard: Keyboard
  public ownPlayer: Player

  public onBuildFactory?: (coord: IGame.Coordinate) => void
  public onMoveProbes?: (probes: Probe[], target: IGame.Coordinate) => void

  private state: InteractionState

  private container: Container

  /** Select pane when dragging */
  private select: Select

  /** Tile that is currently hovered */
  private currentTile: Tile | null

  /** Probe that are currently selected */
  private selectedProbes: Probe[]

  /** Position of the mouse when down */
  private mouseDownPos: IGame.Position

  constructor(map: Map, keyboard: Keyboard, ownPlayer: Player) {
    this.map = map
    this.context = map.context
    this.keyboard = keyboard
    this.ownPlayer = ownPlayer
    this.state = InteractionState.IDLE
    this.container = new Container()
    this.select = new Select(map.context)
    this.currentTile = null
    this.selectedProbes = []
    this.mouseDownPos = { x: 0, y: 0 }

    this.setupKeyboard()
  }

  public setLayout(container: Container) {
    this.container = container
    this.container.interactive = true
    if (!this.container.children.includes(this.select.child())) {
      this.container.addChild(this.select.child())
    }
    this.setupMouseInteraction()
  }

  public getState(): InteractionState {
    return this.state
  }

  /**
   * Set a new state, clean up current state
   */
  private setState(state: InteractionState) {

    if (this.state == InteractionState.SELECT_PROBES) {
      for (const probe of this.selectedProbes) {
        probe.setState(ProbeState.FARMING)
      }
      this.selectedProbes = []
    }

    this.state = state
  }

  /**
   * Return the position corresponding to the mouse position
   */
  private getMousePos(e: InteractionEvent): IGame.Position {
    const pos = e.data.global
    return { x: pos.x, y: pos.y - 50 }
  }

  /**
   * Return the coordinates corresponding to the mouse position
   */
  private getMouseCoord(e: InteractionEvent): IGame.Coordinate {
    const pos = e.data.global
    return this.context.coord({ x: pos.x, y: pos.y - 50 })
  }

  /**
   * Return if the mouse down-up sequence is a click
   * given the up mouse position
   */
  private isClick(pos: IGame.Position): boolean {
    return (
      Math.abs(pos.x - this.mouseDownPos.x) < 10 &&
      Math.abs(pos.y - this.mouseDownPos.y) < 10
    )
  }

  private setupKeyboard() {
    this.keyboard.listen(["b"])
    this.keyboard.addOnPress("b", () => this.updateBuildFactoryState())
  }

  /**
   * If not in build factory state: switch to it
   * if in build factory state: switch to idle
  */
  private updateBuildFactoryState() {
    if (this.state == InteractionState.BUILD_FACTORY) {
      this.setState(InteractionState.IDLE)
    } else {
      this.setState(InteractionState.BUILD_FACTORY)
    }
  }

  private selectProbes(pos: IGame.Position) {
    const start = this.select.getStart()
    const end = pos

    const minX = Math.min(start.x, end.x)
    const minY = Math.min(start.y, end.y)
    const maxX = Math.max(start.x, end.x)
    const maxY = Math.max(start.y, end.y)

    for (const probe of this.selectedProbes) {
      probe.setState(ProbeState.FARMING)
    }
    this.selectedProbes = []

    for (const probe of this.ownPlayer.probes) {
      const { x, y } = probe.getPos()
      if (
        minX <= x &&
        maxY >= y &&
        minY <= y &&
        maxX >= x
      ) {
        probe.setState(ProbeState.SELECTED)
        this.selectedProbes.push(probe)
      }
    }

    if (this.selectedProbes.length > 0) {
      this.setState(InteractionState.SELECT_PROBES)
    }
  }

  private handleClick(pos: IGame.Position) {

    // hide select
    this.select.setVisisble(false)

    const coord = this.context.coord(pos)
    const tile = this.map.tile(coord)

    if (this.state == InteractionState.BUILD_FACTORY) {
      if (!tile) return
      if (this.onBuildFactory) {
        this.onBuildFactory(tile.getCoord())
      }
      this.setState(InteractionState.IDLE)
    } else if (this.state == InteractionState.SELECT_PROBES) {
      if (!tile) return
      if (this.onMoveProbes) {
        this.onMoveProbes(this.selectedProbes, tile.getCoord())
      }
      this.setState(InteractionState.IDLE)
    }
  }

  private handleDown(pos: IGame.Position) {
    this.select.setVisisble(true)
    this.select.setStart(pos)
    this.select.setEnd(pos)
  }

  /**
   * Handle the case where the mouse was dragged,
   * return if the case was handled,
   * if not fall back to handleClick
   */
  private handleDragged(pos: IGame.Position): boolean {
    this.select.setVisisble(false)
    this.selectProbes(pos)
    return true
  }

  private setupMouseInteraction() {

    this.container.on("pointermove", (e) => {

      // update select rect
      if (this.select.getVisible()) {
        this.select.setEnd(this.getMousePos(e))
      }

      // update hover tile
      const coord = this.getMouseCoord(e)
      const tile = this.map.tile(coord)
      if (this.currentTile === tile) return
      if (this.currentTile) {
        this.currentTile.setHover(false)
      }
      if (tile) {
        tile.setHover(true)
      }
      this.currentTile = tile
    })

    // interaction
    this.container.on("pointerdown", (e) => {
      this.mouseDownPos = this.getMousePos(e)
      this.handleDown(this.mouseDownPos)
    })

    this.container.on("pointerup", (e) => {
      const pos = this.getMousePos(e)
      if (this.isClick(pos)) {
        this.handleClick(pos)
      } else {
        const handled = this.handleDragged(pos)
        if (!handled) {
          this.handleClick(pos)
        }
      }

    })
  }

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Interactions