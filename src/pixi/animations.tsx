// types
import { Firebase, IGame, ICore } from "../../types"

// pixi.js
import { Container, Graphics, filters } from "pixi.js"

// pixi
import Context from "./context"
import Color from "../utils/color"
import Turret from "./entity/turret"
import Probe from "./entity/probe"
import Game from "./game"

class Animations implements IGame.Sprite {

  public static readonly TURRET_FIRE_COLOR = Color.WHITE
  public static readonly TURRET_FIRE_WIDTH = 0.05
  public static readonly TURRET_FIRE_DURATION = 0.1

  public context: Context
  private game: Game
  private container: Container

  constructor(context: Context, game: Game) {
    this.context = context
    this.game = game
    this.container = new Container()
  }

  /**
   * Add a container to be displayed on the animations layout
   * for some duration
   */
  public add(container: Container, duration: number) {
    this.container.addChild(container)
    setTimeout(() => {
      this.container.removeChild(container)
    }, duration * 1000)
  }

  /**
   * Display the fire of a turret on a probe
   */
  public addTurretFire(turret: Turret, probe: Probe | IGame.ID) {

    let _probe: Probe = {} as Probe
    if (typeof probe === "string") {
      for (const player of this.game.players) {
        const p = player.probes.find(p => p.getId() === probe)
        if (p) {
          _probe = p
          break
        }
      }
    } else {
      _probe = probe
    }

    const start = turret.getCenter()
    const end = _probe.getCenter()

    const surf = new Graphics()
    surf.lineStyle(
      this.context.unit * Animations.TURRET_FIRE_WIDTH,
      Animations.TURRET_FIRE_COLOR.hex()
    )
      .moveTo(start.x, start.y)
      .lineTo(end.x, end.y)

    const filter = new filters.BlurFilter();
    filter.blur = 1
    surf.filters = [filter]

    this.add(surf, Animations.TURRET_FIRE_DURATION)
  }

  public update(dt: number) { }

  public child(): Container {
    return this.container
  }
}

export default Animations