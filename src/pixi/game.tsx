// types
import { Firebase, IGame } from "../../types"

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

  constructor(pixi: Pixi, comm: Comm, user: Firebase.User, gameState: IGame.Server.GameState) {
    this.pixi = pixi
    this.comm = comm
    this.user = user
    this.keyboard = new Keyboard()

    this.keyboard.listen(["a", "d", "w", "s", "p"])

    this.map = new Map(gameState.dim)

    // setup game
    const colors = [
      Color.fromRgb(220, 100, 100),
      Color.fromRgb(100, 220, 100),
    ]

    this.players = gameState.players.map((p, i) =>
      new Player(p.username, colors[i], this.keyboard, this.map)
    )

    this.ownPlayer = this.players.find((p) => p.username === this.user.username) as Player

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

}

export default Game