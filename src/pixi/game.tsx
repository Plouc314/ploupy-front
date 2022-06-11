// types
import { Firebase, IGame, IModel } from "../../types"

// pixi.js
import { Container, Graphics } from "pixi.js"

// pixi
import Pixi from "./pixi"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import Comm from "../comm/comm"
import Factory from "./entity/factory"
import Probe from "./entity/probe"
import Interactions from "./interactions"
import Context from "./context"
import Turret from "./entity/turret"
import { COLORS } from "./constants"
import Animations from "./animations"



class Game {
  public pixi: Pixi
  public comm: Comm
  public user: Firebase.User
  public context: Context
  public keyboard: Keyboard
  public players: Player[] = []
  public ownPlayer: Player
  public map: Map
  public interactions: Interactions
  public ui: UI
  public animations: Animations
  public layout: Container

  private currentTime: number

  constructor(pixi: Pixi, comm: Comm, user: Firebase.User, model: IModel.Game) {
    this.pixi = pixi
    this.comm = comm
    this.user = user
    this.keyboard = new Keyboard()
    this.context = new Context(pixi, model.config)
    this.map = new Map(this.context, model.map)

    this.pixi.app.renderer.on('resize', () => {
      this.context.update()
      this.onContextUpdate()
    })

    this.currentTime = Date.now()

    this.players = model.players.map((pm, i) =>
      new Player(pm, COLORS[i], this.map)
    )

    this.ownPlayer = this.players.find((p) => p.username === this.user.username) as Player

    // format map model
    const mapModel: IModel.Map<Player> = {
      tiles: model.map.tiles.map(tm => ({
        ...tm,
        owner: this.players.find(p => p.username === tm.owner) ?? undefined
      }))
    }

    this.map.setModel(mapModel)

    this.animations = new Animations(this.context)

    this.comm.setOnBuildFactory((data) => {
      const player = this.players.find(p => p.username === data.username)
      if (!player) return
      player.money = data.money
      const factory = new Factory(player, data.factory)
      player.addFactory(factory)
    })

    this.comm.setOnBuildTurret((data) => {
      const player = this.players.find(p => p.username === data.username)
      if (!player) return
      player.money = data.money
      const turret = new Turret(player, data.turret)
      player.addTurret(turret)
    })

    this.comm.setOnBuildProbe((data) => {
      const player = this.players.find(p => p.username === data.username)
      if (!player) return
      player.money = data.money
      const probe = new Probe(player, data.probe)
      player.addProbe(probe)
    })

    this.comm.setOnGameState((data) => {
      this.setModel(data)
    })

    this.comm.setOnTurretFireProbe((data) => {

      // get firing player
      const player = this.players.find(p => p.username === data.username)
      if (!player) return

      // get fired probe
      let probe: Probe | undefined
      for (const opponent of this.players) {
        if (opponent === player) continue
        probe = opponent.probes.find(p => p.getId() === data.probe.id)
        if (!probe) continue
        opponent.removeProbe(probe)
        const turret = player.turrets.find(t => t.getId() === data.turret_id)
        if (turret) {
          this.animations.addTurretFire(turret, probe)
        }
        break
      }
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

    this.interactions = new Interactions(this.ui, this.keyboard, this.pixi, this.ownPlayer)

    this.interactions.setLayout(this.layout)

    this.interactions.onBuildFactory = (coord) => {
      this.comm.sendActionBuildFactory({
        coord: coord
      })
    }
    this.interactions.onBuildTurret = (coord) => {
      this.comm.sendActionBuildTurret({
        coord: coord
      })
    }
    this.interactions.onMoveProbes = (probes, target) => {
      this.comm.sendActionMoveProbes({
        ids: probes.map(p => p.getId()),
        targets: probes.map(p => target),
      })
    }
    this.interactions.onExplodeProbes = (probes) => {
      this.comm.sendActionExplodeProbes({
        ids: probes.map(p => p.getId()),
      })
    }
    this.interactions.onProbesAttack = (probes) => {
      this.comm.sendActionProbesAttack({
        ids: probes.map(p => p.getId()),
      })
    }

    this.pixi.app.stage.addChild(this.layout)

    this.pixi.app.ticker.add((dt) => this.run())
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


  private setModel(model: IModel.GameState<string>) {
    for (const pm of model.players) {
      const player = this.players.find(p => p.username === pm.username)
      if (!player) continue
      player.setModel(pm)
    }
    if (model.map && model.map.tiles) {
      const mm: IModel.MapState<Player> = {
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