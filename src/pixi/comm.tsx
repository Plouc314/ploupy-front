// types
import { Game } from "../../types"

// comm
import Sio from "../comm/sio"

// pixi
import Player from "./player"

class CommSystem {

    public static onServerState: (state: Game.Comm.ServerState) => void

    public static setup() {
        Sio.sio.on("player_state", (state) => {
            if (this.onServerState) {
                this.onServerState(state)
            }
        })
    }

    public static sendJoinGame(player: Player) {
        Sio.sio.emit("join_game", player.username)
    }

    public static sendPlayerState(player: Player) {
        const state: Game.Comm.PlayerState = {
            username: player.username,
            position: player.pos(),
        }
        Sio.sio.emit("player_state", state)
    }

}

export default CommSystem