// types
import { Game } from "../../types"

// comm
import Sio from "../comm/sio"

// pixi
import Player from "./player"

class CommSystem {


    public static onStartGame: (state: Game.Server.GameState) => void
    public static onPlayerState: (state: Game.Server.PlayerState) => void

    public static setup() {
        Sio.sio.on("player_state", (state) => {
            if (this.onPlayerState) {
                this.onPlayerState(state)
            }
        })
        Sio.sio.on("start_game", (state) => {
            if (this.onStartGame) {
                this.onStartGame(state)
            }
        })
    }

    public static sendJoinGame() {
        Sio.sio.emit("join_queue")
    }

    public static sendPlayerState(player: Player) {
        const state: Game.Client.PlayerState = {
            position: player.pos(),
        }
        Sio.sio.emit("player_state", state)
    }

}

export default CommSystem