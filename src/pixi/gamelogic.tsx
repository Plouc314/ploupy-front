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
import User from "../comm/user"


class GameLogic {
  public static dimension: Game.Dimension = { x: 20, y: 20 }
  public static players: Player[] = []
  public static ownPlayer: Player
  public static map: Map
  public static ui: UI
  public static layout: Container
  public static isGame: boolean = false

  public static setup() {
    BonusSystem.setup()
    CommSystem.setup()
    CommSystem.onPlayerState = this.onPlayerState
    CommSystem.onStartGame = this.onStartGame
    this.isGame = false
  }

  public static runstr() {
    console.group("run")
    console.log(this.isGame)
    console.log(this.ownPlayer)
    console.groupEnd()
    if (!this.isGame) return
    if (!this.ownPlayer) return
    this.ownPlayer.update()

    BonusSystem.update(this.ownPlayer)
    CommSystem.sendPlayerState(this.ownPlayer)

    this.ui.update()
  }

  private static onStartGame(state: Game.Server.GameState) {
    console.group("start game")
    console.dir(state)
    console.groupEnd()
    const colors = [
      Color.fromRgb(220, 100, 100),
      Color.fromRgb(100, 220, 100),
    ]

    this.isGame = true

    this.players = state.players.map((p, i) => {
      const player: Player = new Player(p.username, colors[i])
      player.score = p.score
      player.setPos(p.position)
      return player
    })

    this.ownPlayer = this.players.find((p) => p.username === User.username) as Player

    this.ui = new UI(Pixi.app.view.width)
    this.layout = new Container()
    this.layout.position.y = 50

    this.map = new Map(this.dimension)

    this.layout.addChild(this.map.child())
    this.players.forEach(p => this.layout.addChild(p.child()))
    // this.layout.addChild(BonusSystem.child())

    Pixi.app.stage.addChild(this.layout)
    Pixi.app.stage.addChild(this.ui.child())

    Keyboard.setup()
    Keyboard.listen(["a", "d", "w", "s", "p"])

    console.log(GameLogic.runstr)
    console.dir(GameLogic)

    Pixi.app.ticker.add(GameLogic.runstr)
  }

  private static onPlayerState(state: Game.Server.PlayerState) {
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