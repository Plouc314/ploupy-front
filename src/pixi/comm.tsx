// types
import { IComm, IModel } from "../../types"

// socket io
import { Socket } from "socket.io-client"

class Comm {

  public sio: Socket

  constructor(sio: Socket) {
    this.sio = sio
  }

  public sendJoinGame() {
    this.sio.emit("join_queue")
  }

  public sendActionBuildFactory(data: IModel.ActionBuildFactory) {
    this.sio.emit("action_build_factory", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionBuildTurret(data: IModel.ActionBuildTurret) {
    this.sio.emit("action_build_turret", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionMoveProbes(data: IModel.ActionMoveProbes) {
    this.sio.emit("action_move_probes", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionExplodeProbes(data: IModel.ActionExplodeProbes) {
    this.sio.emit("action_explode_probes", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionProbesAttack(data: IModel.ActionProbesAttack) {
    this.sio.emit("action_probes_attack", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public setOnGameState(cb: (data: IModel.GameState) => void) {
    this.sio.on("game_state", (data) => { cb(data) })
  }

  public setOnStartGame(cb: (data: IModel.Game) => void) {
    this.sio.on("start_game", (data) => {
      console.group("start_game")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnBuildFactory(cb: (data: IComm.BuildFactoryResponse) => void) {
    this.sio.on("build_factory", (data) => {
      console.group("build_factory")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnBuildTurret(cb: (data: IComm.BuildTurretResponse) => void) {
    this.sio.on("build_turret", (data) => {
      console.group("build_turret")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnBuildProbe(cb: (data: IComm.BuildProbeResponse) => void) {
    this.sio.on("build_probe", (data) => {
      console.group("build_probe")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnTurretFireProbe(cb: (data: IComm.TurretFireProbeResponse) => void) {
    this.sio.on("turret_fire_probe", (data) => {
      cb(data)
    })
  }

}

export default Comm