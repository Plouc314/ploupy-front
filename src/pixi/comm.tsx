// types
import { IGame } from "../../types"

// socket io
import { Socket } from "socket.io-client"

// pixi
import Player from "./player"

class Comm {

    public sio: Socket

    constructor(sio: Socket) {
        this.sio = sio
    }

    public sendJoinGame() {
        this.sio.emit("join_queue")
    }

    public sendPlayerState(state: IGame.Client.PlayerState) {
        this.sio.emit("player_state", state)
    }

    public setOnStartGame(cb: (state: IGame.Server.GameState) => void) {
        this.sio.on("start_game", (state) => { cb(state) })
    }

    public setOnPlayerState(cb: (state: IGame.Server.PlayerState) => void) {
        this.sio.on("player_state", (state) => { cb(state) })
    }

}

export default Comm