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

    public sendActionBuild(data: IModel.ActionBuild) {
        this.sio.emit("action_build", data)
    }

    public setOnStartGame(cb: (data: IModel.Game) => void) {
        this.sio.on("start_game", (data) => { cb(data) })
    }

    public setOnActionBuild(cb: (data: IComm.ActionBuildResponse) => void) {
        this.sio.on("action_build", (data) => { cb(data) })
    }

}

export default Comm