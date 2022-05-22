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

  public sendActionBuild(data: IModel.ActionBuildFactory) {
    this.sio.emit("action_build_factory", data, (response: IComm.Response) => {
      console.log(response)
    })
  }

  public setOnGameState(cb: (data: IModel.GameState) => void) {
    this.sio.on("game_state", (data) => { cb(data) })
  }

  public setOnStartGame(cb: (data: IModel.Game) => void) {
    this.sio.on("start_game", (data) => { cb(data) })
  }

  public setOnBuildFactory(cb: (data: IComm.BuildFactoryResponse) => void) {
    this.sio.on("build_factory", (data) => {
      console.group("build_factory")
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

}

export default Comm