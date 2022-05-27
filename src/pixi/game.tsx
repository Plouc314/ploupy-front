// types
import { Firebase, IGame, IModel } from "../../types"

// pixi.js
import { Container, settings } from "pixi.js"

// pixi
import Pixi from "./pixi"
import Color from "../utils/color"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import Comm from "./comm"
import Factory from "./entity/factory"
import Probe from "./entity/probe"
import Interactions from "./interactions"
import Context from "./context"



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
  public layout: Container

  private currentTime: number

  constructor(pixi: Pixi, comm: Comm, user: Firebase.User, model: IModel.Game) {
    this.pixi = pixi
    this.comm = comm
    this.user = user
    this.keyboard = new Keyboard()
    this.context = new Context(pixi, model.config)
    this.map = new Map(this.context, model.map)

    this.currentTime = Date.now()

    // setup game
    const colors = [
      Color.fromRgb(250, 100, 100),
      Color.fromRgb(100, 100, 250),
    ]

    this.players = model.players.map((pm, i) =>
      new Player(pm, colors[i], this.map)
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

    this.comm.setOnBuildFactory((data) => {
      const player = this.players.find(p => p.username === data.username)
      if (!player) return
      player.money = data.money
      const factory = new Factory(player, data.factory)
      player.addFactory(factory)
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

    this.ui = new UI(this, this.pixi.app.view.width)
    this.layout = new Container()
    this.layout.position.y = UI.HEIGHT

    this.layout.addChild(this.map.child())
    for (const player of this.players) {
      this.layout.addChild(player.child())
    }

    this.interactions = new Interactions(this.map, this.keyboard, this.ownPlayer)

    this.interactions.setLayout(this.layout)

    this.interactions.onBuildFactory = (coord) => {
      this.comm.sendActionBuildFactory({
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

    this.pixi.app.stage.addChild(this.layout)
    this.pixi.app.stage.addChild(this.ui.child())

    this.pixi.app.ticker.add((dt) => this.run())
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