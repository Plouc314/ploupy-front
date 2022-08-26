// types
import { Firebase, IGame } from "../../types"

// pixi.js
import { Container, Graphics } from "pixi.js"

// pixi
import Pixi from "./pixi"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import Comm from "../comm/comm"
import Interactions from "./interactions"
import Context from "./context"
import { COLORS } from "./constants"
import Animations from "./animations"



class Game {
  public gid: string
  public pixi: Pixi
  public comm: Comm
  public user: Firebase.User
  public context: Context
  public keyboard: Keyboard
  public players: Player[] = []
  public ownPlayer?: Player
  public map: Map
  public interactions?: Interactions
  public ui: UI
  public animations: Animations
  public layout: Container
  public isSpectator: boolean

  private currentTime: number

  constructor(gid: string, pixi: Pixi, comm: Comm, user: Firebase.User, model: IGame.GameState) {

    if (!this.assertCompleteModel(model)) {
      throw Error("Incomplete model" + model)
    }

    this.gid = gid
    this.pixi = pixi
    this.comm = comm
    this.user = user
    this.keyboard = new Keyboard()
    this.context = new Context(pixi, model.config)
    this.map = new Map(this.context, model.map)
    this.animations = new Animations(this.context, this)

    this.pixi.app.renderer.on('resize', () => {
      this.context.update()
      this.onContextUpdate()
    })

    this.currentTime = Date.now()

    this.players = model.players.map((pm, i) =>
      new Player(pm, COLORS[i], this.map, this.animations)
    )

    // search for user's username in game's players
    // if not found -> user is a spectator
    this.ownPlayer = this.players.find((p) => p.username === this.user.username)

    this.isSpectator = !this.ownPlayer

    // format map model
    const mapModel: IGame.MapState<Player> = {
      tiles: model.map.tiles.map(tm => ({
        ...tm,
        owner: this.players.find(p => p.username === tm.owner) ?? undefined
      }))
    }

    this.map.setModel(mapModel)

    this.comm.setOnGameState((data) => {
      this.setModel(data)
    })

    this.ui = new UI(this, this.context)

    // create main layout
    this.layout = new Container()

    this.layout.addChild(this.map.child())
    for (const player of this.players) {
      this.layout.addChild(player.child())
    }
    this.layout.addChild(this.animations.child())
    this.layout.addChild(this.ui.child())

    // link action errors to ui
    this.comm.setOnGameActionError((msg) => {
      this.ui.setGameActionError(msg)
    })

    if (!this.isSpectator) {
      this.setupInteractions()
    }

    this.pixi.app.stage.addChild(this.layout)

    this.pixi.app.ticker.add((dt) => this.run())
  }

  private setupInteractions() {
    this.interactions = new Interactions(
      this.ui,
      this.keyboard,
      this.pixi,
      this.ownPlayer as Player,
    )

    this.interactions.setLayout(this.layout)

    this.interactions.onBuildFactory = (coord) => {
      this.comm.sendActionBuildFactory({
        gid: this.gid,
        coord: coord
      })
    }
    this.interactions.onBuildTurret = (coord) => {
      this.comm.sendActionBuildTurret({
        gid: this.gid,
        coord: coord
      })
    }
    this.interactions.onMoveProbes = (probes, target) => {
      this.comm.sendActionMoveProbes({
        gid: this.gid,
        ids: probes.map(p => p.getId()),
        target: target,
      })
    }
    this.interactions.onExplodeProbes = (probes) => {
      this.comm.sendActionExplodeProbes({
        gid: this.gid,
        ids: probes.map(p => p.getId()),
      })
    }
    this.interactions.onProbesAttack = (probes) => {
      this.comm.sendActionProbesAttack({
        gid: this.gid,
        ids: probes.map(p => p.getId()),
      })
    }
    this.interactions.onAcquireTech = (tech) => {
      this.comm.sendActionAcquireTech({
        gid: this.gid,
        tech: tech,
      })
    }
  }

  private assertCompleteModel(model: IGame.GameState): model is IGame.Game {
    if (!model.map?.tiles) return false
    return true
  }

  /**
   * Destroy the game
   * Reset: comm (in-game part), keyboard, pixi
   */
  public destroy() {
    this.comm.removeGameListeners()
    this.keyboard.reset()
    this.pixi.app.destroy()
  }

  /**
   * Executed when the context is updated,
   * for example: on resize of the canvas
   */
  public onContextUpdate() {
    this.ui.onContextUpdate()
    this.map.onContextUpdate()
    for (const player of this.players) {
      player.onContextUpdate()
    }
  }

  private run() {

    const now = Date.now()
    const dt = (now - this.currentTime) / 1000
    this.currentTime = now

    for (const player of this.players) {
      player.update(dt)
    }

    this.ui.update(dt)
  }

  private setModel(model: IGame.GameState<string>) {
    for (const pm of model.players) {
      const player = this.players.find(p => p.username === pm.username)
      if (!player) continue
      player.setModel(pm)
    }
    if (model.map && model.map.tiles) {
      const mm: IGame.MapState<Player> = {
        tiles: model.map.tiles.map(tm => ({
          ...tm,
          owner: this.players.find(p => p.username === tm.owner) ?? null
        }))
      }
      this.map.setModel(mm)
    }
  }
}

export default Game