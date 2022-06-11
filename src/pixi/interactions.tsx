// types
import { IGame, IModel } from '../../types'

// pixi.js
import { Container, InteractionEvent } from 'pixi.js'

// pixi
import Tile from './entity/tile'
import Map from './map'
import Select from './ui/select'
import Keyboard from './keyboard'
import Player from './player'
import Probe, { ProbeState } from './entity/probe'
import UI from './ui'
import Context from './context'
import Pixi from './pixi'
import Color from '../utils/color'
import ImageUI from './ui/node/image'

export enum InteractionState {
  IDLE = "IDLE",
  BUILD_FACTORY = "BUILD_FACTORY",
  BUILD_TURRET = "BUILD_TURRET",
  SELECT_PROBES = "SELECT_PROBES",
}

class Interactions implements IGame.Sprite {

  public static readonly CURSOR_SIZE = 0.35

  public ui: UI
  public map: Map
  public context: Context
  public keyboard: Keyboard
  public pixi: Pixi
  public ownPlayer: Player

  public onBuildFactory?: (coord: IGame.Coordinate) => void
  public onBuildTurret?: (coord: IGame.Coordinate) => void
  public onMoveProbes?: (probes: Probe[], target: IGame.Coordinate) => void
  public onExplodeProbes?: (probes: Probe[]) => void
  public onProbesAttack?: (probes: Probe[]) => void

  private state: InteractionState

  private container: Container

  /** Select pane when dragging */
  private select: Select

  private cursor: ImageUI

  /** Tile that is currently hovered */
  private currentTile: Tile | null

  /** Probe that are currently selected */
  private selectedProbes: Probe[]

  /** Position of the mouse when down */
  private mouseDownPos: IGame.Position

  constructor(ui: UI, keyboard: Keyboard, pixi: Pixi, ownPlayer: Player) {
    this.ui = ui
    this.map = ui.game.map
    this.context = ui.context
    this.keyboard = keyboard
    this.pixi = pixi
    this.ownPlayer = ownPlayer
    this.state = InteractionState.IDLE

    this.cursor = new ImageUI(this.context)
    this.cursor.dim = {
      width: this.context.sizes.ui.cursor,
      height: this.context.sizes.ui.cursor,
    }
    this.cursor.anchorY = "bottom"
    this.cursor.texture = this.pixi.textures.getIcon("factory", Color.WHITE)
    this.cursor.child().visible = false

    this.container = new Container()
    this.select = new Select(this.context)
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
    if (!this.container.children.includes(this.cursor.child())) {
      this.container.addChild(this.cursor.child())
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
      this.selectedProbes.length = 0
    }

    // remove highlight on tiles
    if (
      (this.state == InteractionState.BUILD_FACTORY ||
        this.state == InteractionState.BUILD_TURRET) &&
      (state == InteractionState.IDLE ||
        state == InteractionState.SELECT_PROBES)
    ) {
      this.ownPlayer.isTileHighlightState = false
      for (const tile of this.map.allTiles()) {
        tile.setHighlightState(false)
      }
    }

    // add highlight on tiles
    if (
      (state == InteractionState.BUILD_FACTORY ||
        state == InteractionState.BUILD_TURRET) &&
      (this.state == InteractionState.IDLE ||
        this.state == InteractionState.SELECT_PROBES)
    ) {

      this.ownPlayer.isTileHighlightState = true
      for (const tile of this.map.allTiles()) {
        if (tile.owner === this.ownPlayer) {
          tile.setHighlightState(true)
        }
      }
    }

    this.updateCursor(state)
    this.state = state
  }

  /** update the cursor depending on the state */
  private updateCursor(state: InteractionState) {
    let visible: boolean
    if (state == InteractionState.BUILD_FACTORY) {
      this.cursor.texture = this.pixi.textures.getIcon("factory", Color.WHITE)
      visible = true
    } else if (state == InteractionState.BUILD_TURRET) {
      this.cursor.texture = this.pixi.textures.getIcon("turret", Color.WHITE)
      visible = true
    } else {
      visible = false
    }
    this.cursor.compile()
    this.cursor.child().visible = visible
  }

  /**
   * Return the position corresponding to the mouse position
   */
  private getMousePos(e: InteractionEvent): IGame.Position {
    const pos = e.data.global
    return this.context.clampToDim({
      x: pos.x,
      y: pos.y,
    })
  }

  /**
   * Return the coordinates corresponding to the mouse position
   * Transformed to map
   */
  private getMouseCoord(e: InteractionEvent): IGame.Coordinate {
    return this.context.coord(this.getMousePos(e))
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
    this.keyboard.listen(["f", "t", "a", "x", "s", Keyboard.ESCAPE])
    this.keyboard.addOnPress("f", () => this.ui.buttons.factory.click())
    this.keyboard.addOnPress("t", () => this.ui.buttons.turret.click())
    this.keyboard.addOnPress("x", () => this.ui.buttons.explode.click())
    this.keyboard.addOnPress("a", () => this.ui.buttons.attack.click())
    this.keyboard.addOnPress("s", () => this.selectAllProbes())
    this.keyboard.addOnPress(Keyboard.ESCAPE, () => this.backToIdle())

    this.ui.buttons.factory.onClick = () => this.updateBuildFactoryState()
    this.ui.buttons.turret.onClick = () => this.updateBuildTurretState()
    this.ui.buttons.explode.onClick = () => this.explodeProbes()
    this.ui.buttons.attack.onClick = () => this.probesAttack()
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

  /**
   * If not in build turret state: switch to it
   * if in build turret state: switch to idle
  */
  private updateBuildTurretState() {
    if (this.state == InteractionState.BUILD_TURRET) {
      this.setState(InteractionState.IDLE)
    } else {
      this.setState(InteractionState.BUILD_TURRET)
    }
  }

  private explodeProbes() {
    if (this.state !== InteractionState.SELECT_PROBES) return
    if (this.onExplodeProbes) {
      this.onExplodeProbes(this.selectedProbes)
    }
    this.setState(InteractionState.IDLE)
  }

  private probesAttack() {
    if (this.state !== InteractionState.SELECT_PROBES) return
    if (this.onProbesAttack) {
      this.onProbesAttack(this.selectedProbes)
    }
    this.setState(InteractionState.IDLE)
  }

  private selectAllProbes() {
    this.selectedProbes = [...this.ownPlayer.probes]
    for (const probe of this.selectedProbes) {
      probe.setState(ProbeState.SELECTED)
    }
    if (
      this.selectedProbes.length > 0 &&
      this.state != InteractionState.SELECT_PROBES
    ) {
      this.setState(InteractionState.SELECT_PROBES)
    }
  }

  private backToIdle() {
    this.setState(InteractionState.IDLE)
  }

  /**
   * The given position should NOT be transformed to map (see toMap)
   */
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
    this.selectedProbes.length = 0

    for (const probe of this.ownPlayer.probes) {
      const { x, y } = probe.getCenter()
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

    if (
      this.selectedProbes.length > 0 &&
      this.state != InteractionState.SELECT_PROBES
    ) {
      this.setState(InteractionState.SELECT_PROBES)
    } else if (
      this.selectedProbes.length == 0 &&
      this.state == InteractionState.SELECT_PROBES
    ) {
      this.setState(InteractionState.IDLE)
    }

  }

  private handleClick(coord: IGame.Coordinate) {

    // hide select
    this.select.setVisisble(false)

    const tile = this.map.tile(coord)

    if (this.state == InteractionState.BUILD_FACTORY) {
      if (!tile) return
      if (this.onBuildFactory) {
        this.onBuildFactory(tile.getCoord())
      }
      this.setState(InteractionState.IDLE)

    } else if (this.state == InteractionState.BUILD_TURRET) {
      if (!tile) return
      if (this.onBuildTurret) {
        this.onBuildTurret(tile.getCoord())
      }
      this.setState(InteractionState.IDLE)

    } else if (this.state == InteractionState.SELECT_PROBES) {
      if (!tile) return

      if (this.onMoveProbes) {
        this.onMoveProbes(this.selectedProbes, tile.getCoord())
      }
    }
  }

  private handleDown(pos: IGame.Position) {
    if (!this.map.isInExtendedMap(this.context.coord(pos))) return
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

      const pos = this.getMousePos(e)

      this.cursor.pos = pos
      this.cursor.compile()

      // update select rect
      if (this.select.getVisible()) {
        this.select.setEnd(pos)
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
      const coord = this.getMouseCoord(e)
      if (this.isClick(pos)) {
        this.handleClick(coord)
      } else {
        const handled = this.handleDragged(pos)
        if (!handled) {
          this.handleClick(coord)
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