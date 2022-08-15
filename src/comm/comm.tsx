// types
import { IComm, IGame, IActions } from "../../types"

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
   * Remove all in-game listeners (defined by Game)
   */
  public removeGameListeners() {
    this.sio.removeAllListeners("game_state")
  }

  /**
   * The callback is called when an error occur on an action
   */
  public setOnGameActionError(cb: (msg: string) => void) {
    this.onGameActionError = cb
  }

  /**
   * Trigger the server to send the current user manager state
   */
  public refreshUserManager() {
    this.sio.emit("man_user_state", null, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  /**
   * Trigger the server to send the current queue manager state
   */
  public refreshQueueManager() {
    this.sio.emit("man_queue_state", null, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  /**
   * Trigger the server to send the current game manager state
   */
  public refreshGameManager() {
    this.sio.emit("man_game_state", null, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  /**
   * Request the server to check if the user is currently in a game
   * for example, after a disconnection.
   * If so, the server will automatically send an start_game event
   */
  public checkActiveGame() {
    this.sio.emit("is_active_game", null, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  /**
   * Request to have the current game state sent from the server
   * (must already be in a game)
   */
  public getGameState(data: IActions.GameState, cb?: (r: IComm.Response) => void) {
    this.sio.emit("game_state", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
      if (cb) cb(response)
    })
  }

  public sendActionCreateQueue(data: IActions.CreateQueue) {
    this.sio.emit("create_queue", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  public sendActionJoinQueue(data: IActions.JoinQueue) {
    this.sio.emit("join_queue", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  public sendActionLeaveQueue(data: IActions.LeaveQueue) {
    this.sio.emit("leave_queue", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  public sendActionSendQueueInvitation(data: IActions.SendQueueInvitation) {
    this.sio.emit("send_queue_invitation", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  public sendActionDisconnectBot(data: IActions.DisconnectBot) {
    this.sio.emit("disconnect_bot", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      console.log(response)
    })
  }

  public sendActionResignGame(data: IActions.ResignGame) {
    this.sio.emit("action_resign_game", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionBuildFactory(data: IActions.BuildFactory) {
    this.sio.emit("action_build_factory", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionBuildTurret(data: IActions.BuildTurret) {
    this.sio.emit("action_build_turret", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionMoveProbes(data: IActions.MoveProbes) {
    this.sio.emit("action_move_probes", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionExplodeProbes(data: IActions.ExplodeProbes) {
    this.sio.emit("action_explode_probes", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public sendActionProbesAttack(data: IActions.ProbesAttack) {
    this.sio.emit("action_probes_attack", data, (raw: string) => {
      const response = JSON.parse(raw) as IComm.Response
      if (!response.success) {
        this.onGameActionError(response.msg)
      }
    })
  }

  public setOnUserManagerState(cb: (data: IComm.UserManagerState) => void) {
    this.sio.removeAllListeners("man_user_state")
    this.sio.on("man_user_state", (data) => { cb(JSON.parse(data)) })
  }

  public setOnQueueManagerState(cb: (data: IComm.QueueManagerState) => void) {
    this.sio.removeAllListeners("man_queue_state")
    this.sio.on("man_queue_state", (data) => { cb(JSON.parse(data)) })
  }

  public setOnGameManagerState(cb: (data: IComm.GameManagerState) => void) {
    this.sio.removeAllListeners("man_game_state")
    this.sio.on("man_game_state", (data) => { console.log(data); cb(JSON.parse(data)) })
  }

  public setOnGameState(cb: (data: IGame.GameState) => void) {
    this.sio.removeAllListeners("game_state")
    this.sio.on("game_state", (data) => { cb(JSON.parse(data)) })
  }

  public setOnStartGame(cb: (data: IComm.StartGameResponse) => void) {
    this.sio.removeAllListeners("start_game")
    this.sio.on("start_game", (data) => {
      console.group("start_game")
      console.log(data)
      console.groupEnd()
      cb(JSON.parse(data))
    })
  }

  public setOnGameResult(cb: (data: IComm.GameResultResponse) => void) {
    this.sio.removeAllListeners("game_result")
    this.sio.on("game_result", (data) => {
      console.group("game_result")
      console.log(data)
      console.groupEnd()
      cb(JSON.parse(data))
    })
  }

}

export default Comm