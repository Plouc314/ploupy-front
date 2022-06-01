// types
import { IComm, IModel } from "../../types"

// socket io
import { Socket } from "socket.io-client"

class Comm {

  public sio: Socket
  private onGameActionError: (msg: string) => void

  constructor(sio: Socket) {
    this.sio = sio
    this.onGameActionError = () => { }
  }

  /**
   * The callback is called when an error occur on an action
   */
  public setOnGameActionError(cb: (msg: string) => void) {
    this.onGameActionError = cb
  }

  public sendActionCreateQueue(data: IComm.ActionCreateQueue) {
    this.sio.emit("create_queue", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionJoinQueue(data: IComm.ActionJoinQueue) {
    this.sio.emit("join_queue", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionLeaveQueue(data: IComm.ActionLeaveQueue) {
    this.sio.emit("leave_queue", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public sendActionBuildFactory(data: IModel.ActionBuildFactory) {
    this.sio.emit("action_build_factory", data, (response: IComm.Response) => {
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionBuildTurret(data: IModel.ActionBuildTurret) {
    this.sio.emit("action_build_turret", data, (response: IComm.Response) => {
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionMoveProbes(data: IModel.ActionMoveProbes) {
    this.sio.emit("action_move_probes", data, (response: IComm.Response) => {
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionExplodeProbes(data: IModel.ActionExplodeProbes) {
    this.sio.emit("action_explode_probes", data, (response: IComm.Response) => {
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionProbesAttack(data: IModel.ActionProbesAttack) {
    this.sio.emit("action_probes_attack", data, (response: IComm.Response) => {
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public setOnQueueState(cb: (data: IModel.Queue) => void) {
    this.sio.on("queue_state", (data) => { cb(data) })
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