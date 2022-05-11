// types
import { Firebase, IGame } from "../../types"

// pixi.js
import { Container } from "pixi.js"

// pixi
import Pixi from "./pixi"
import Color from "./color"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"
import UI from "./ui"
import BonusSystem from "./bonus"
import CommSystem from "./comm"
import Tile from "./tile"
import User from "../comm/user"
import Comm from "./comm"


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
  public isGame: boolean

  constructor(pixi: Pixi, comm: Comm, user: Firebase.User) {
    this.pixi = pixi
    this.comm = comm
    this.user = user
    this.keyboard = new Keyboard()
    this.isGame = false

    this.comm.setOnPlayerState(this.onPlayerState)

    this.keyboard.listen(["a", "d", "w", "s", "p"])
  }

  public runstr() {
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

  private onStartGame(state: IGame.Server.GameState) {
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

  private onPlayerState(state: IGame.Server.PlayerState) {
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

export default Game