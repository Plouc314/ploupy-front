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

  public refreshQueueState() {
    this.sio.emit("queue_state", null, (response: IComm.Response) => {
      console.log(response)
    })
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

  public sendActionResignGame(data: IModel.ActionResignGame) {
    this.sio.emit("action_resign_game", data, (response: IComm.Response) => {
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
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

  public setOnQueueState(cb: (data: IComm.QueueStateResponse) => void) {
    this.sio.removeAllListeners("queue_state")
    this.sio.on("queue_state", (data) => { cb(data) })
  }

  public setOnGameState(cb: (data: IModel.GameState) => void) {
    this.sio.removeAllListeners("game_state")
    this.sio.on("game_state", (data) => { cb(data) })
  }

  public setOnStartGame(cb: (data: IModel.Game) => void) {
    this.sio.removeAllListeners("start_game")
    this.sio.on("start_game", (data) => {
      console.group("start_game")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnGameResult(cb: (data: IComm.GameResultResponse) => void) {
    this.sio.removeAllListeners("game_result")
    this.sio.on("game_result", (data) => {
      console.group("game_result")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnBuildFactory(cb: (data: IComm.BuildFactoryResponse) => void) {
    this.sio.removeAllListeners("build_factory")
    this.sio.on("build_factory", (data) => {
      console.group("build_factory")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnBuildTurret(cb: (data: IComm.BuildTurretResponse) => void) {
    this.sio.removeAllListeners("build_turret")
    this.sio.on("build_turret", (data) => {
      console.group("build_turret")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnBuildProbe(cb: (data: IComm.BuildProbeResponse) => void) {
    this.sio.removeAllListeners("build_probe")
    this.sio.on("build_probe", (data) => {
      console.group("build_probe")
      console.log(data)
      console.groupEnd()
      cb(data)
    })
  }

  public setOnTurretFireProbe(cb: (data: IComm.TurretFireProbeResponse) => void) {
    this.sio.removeAllListeners("turret_fire_probe")
    this.sio.on("turret_fire_probe", (data) => {
      cb(data)
    })
  }

}

export default Comm