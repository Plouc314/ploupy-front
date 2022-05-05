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

class GameLogic {
  public static dimension: Game.Dimension = { x: 20, y: 20 }
  public static players: Player[] = []
  public static map: Map
  public static ui: UI
  public static layout: Container
  private static idx = 0

  public static setup() {
    this.players = [
      new Player(Color.fromRgb(220, 100, 100)),
      new Player(Color.fromRgb(100, 220, 100)),
    ]

    BonusSystem.setup()

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
    Keyboard.addOnPress("Tab", () => {
      this.idx++
    })
  }

  public static run() {
    if (this.players.length == 0) return
    const player = this.players[this.idx % this.players.length]
    player.update()

    BonusSystem.update(player)

    this.ui.update()
  }

}

export default GameLogic