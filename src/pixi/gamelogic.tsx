// pixi
import Pixi from "./app"
import Color from "./color"
import Keyboard from "./keyboard"
import Map from "./map"
import Player from "./player"

class GameLogic {
  public static players: Player[] = []
  public static map: Map
  private static idx = 0

  public static setup() {
    this.players = [
      new Player(),
      new Player(),
    ]
    this.map = new Map({ x: 10, y: 10 })

    Pixi.app.stage.addChild(this.map.child())
    this.players.forEach(p => Pixi.app.stage.addChild(p.child()))

    Keyboard.setup()
    Keyboard.listen(["a", "d", "w", "s"])
    Keyboard.addOnPress("Tab", () => {
      this.idx++
    })
  }

  public static run() {
    if (this.players.length == 0) return
    const player = this.players[this.idx % this.players.length]
    player.update()
    const tile = this.map.tile(this.map.coord(player.pos()))
    if (tile) {
      tile.setColor(Color.fromRgb(180, 80, 80))
    }
  }

}

export default GameLogic