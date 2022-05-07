// types
import { Game } from "../../types"

// pixi.js
import { Container } from "pixi.js"

// pixi
import Pixi from "./app"
import Color from "./color"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import BonusSystem from "./bonus"
import CommSystem from "./comm"
import Tile from "./tile"


class GameLogic {
  public static dimension: Game.Dimension = { x: 20, y: 20 }
  public static players: Player[] = []
  public static map: Map
  public static ui: UI
  public static layout: Container
  private static idx: number

  public static setup(idx: number) {
    this.players = [
      new Player("Player 0", Color.fromRgb(220, 100, 100)),
      new Player("Player 1", Color.fromRgb(100, 220, 100)),
    ]
    this.idx = idx
    BonusSystem.setup()
    CommSystem.setup()
    CommSystem.onServerState = this.onServerState

    this.ui = new UI(Pixi.app.view.width)
    this.layout = new Container()
    this.layout.position.y = 50

    this.map = new Map(this.dimension)

    this.layout.addChild(this.map.child())
    this.players.forEach(p => this.layout.addChild(p.child()))
    this.layout.addChild(BonusSystem.child())

    Pixi.app.stage.addChild(this.layout)
    Pixi.app.stage.addChild(this.ui.child())

    this.players[0].child().position.x = 500
    this.players[0].child().position.y = 500

    Keyboard.setup()
    Keyboard.listen(["a", "d", "w", "s", "p"])
  }

  public static run() {
    if (this.players.length == 0) return
    // const player = this.players[this.idx % this.players.length]
    const player = this.players[this.idx]

    player.update()

    BonusSystem.update(player)
    CommSystem.sendPlayerState(player)

    this.ui.update()
  }

  private static onServerState(state: Game.Comm.ServerState) {
    const player = this.players.find(p => p.username === state.username)
    if (!player) return

    player.setPos(state.position)
    player.score = state.score

    for (const coord of state.tiles) {
      const tile = this.map.tile(coord) as Tile
      tile.setOwner(player)
      if (player.tiles.indexOf(tile) == -1) {
        player.tiles.push(tile)
      }
    }
  }

}

export default GameLogic