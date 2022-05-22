// types
import { Firebase, IGame, IModel } from "../../types"

// pixi.js
import { Container } from "pixi.js"

// pixi
import Pixi from "./pixi"
import Color from "../utils/color"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import Tile from "./entity/tile"
import Comm from "./comm"
import Factory from "./entity/factory"


class Game {
  public pixi: Pixi
  public comm: Comm
  public user: Firebase.User
  public keyboard: Keyboard
  public players: Player[] = []
  public ownPlayer: Player
  public map: Map
  public ui: UI
  public layout: Container

  constructor(pixi: Pixi, comm: Comm, user: Firebase.User, model: IModel.Game) {
    this.pixi = pixi
    this.comm = comm
    this.user = user
    this.keyboard = new Keyboard()

    this.keyboard.listen(["a", "d", "w", "s", "p"])

    this.map = new Map(model.config, model.map)

    // setup game
    const colors = [
      Color.fromRgb(250, 100, 100),
      Color.fromRgb(100, 100, 250),
    ]

    this.players = model.players.map((pm, i) =>
      new Player(pm, colors[i], this.keyboard, this.map)
    )

    this.ownPlayer = this.players.find((p) => p.username === this.user.username) as Player

    // format map model
    const mapModel: IModel.Map<Player> = {
      tiles: model.map.tiles.map(tm => ({
        ...tm,
        owner: this.players.find(p => p.username === tm.owner) ?? null
      }))
    }

    this.map.setModel(mapModel)


    this.map.setOnClick((coord) => {
      this.comm.sendActionBuild({
        coord: coord
      })
    })

    this.comm.setOnActionBuild((data) => {
      const player = this.players.find(p => p.username === data.username)
      if (!player) return
      const factory = new Factory(player, data.factory)
      player.addFactory(factory)
    })

    this.comm.setOnGameState((data) => {
      this.setModel(data)
    })

    this.ui = new UI(this, this.pixi.app.view.width)
    this.layout = new Container()
    this.layout.position.y = 50

    this.layout.addChild(this.map.child())
    for (const player of this.players) {
      this.layout.addChild(player.child())
    }

    this.pixi.app.stage.addChild(this.layout)
    this.pixi.app.stage.addChild(this.ui.child())

    this.pixi.app.ticker.add((dt) => this.run(dt))
  }

  private run(dt: number) {
    if (!this.ownPlayer) return
    this.ownPlayer.update(dt)

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