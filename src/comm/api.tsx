// types
import { IActions, IComm, ICore } from "../../types"

// comm
import { URL_API } from './config'

/**
 * Interface to the server api
 */
class API {

  public static async get<R extends {}>(
    endpoint: string, args?: Record<string, any>
  ): Promise<IComm.Response<R>> {

    let url = URL_API + endpoint

    if (args) {
      url += "?" + Object.entries(args).map(v => v[0] + "=" + v[1]).join("&")
    }

    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      }
    )
    return await response.json()
  }

  public static async post<T extends {}, R extends {} = {}>(
    endpoint: string, body: T
  ): Promise<IComm.Response<R>> {
    const response = await fetch(
      URL_API + endpoint,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(body),
      }
    )
    return await response.json()
  }

  public static async getUserData(
    args: { uid?: string, username?: string }
  ): Promise<ICore.User | null> {
    const response = await this.get<IComm.UserResponse>("user-data", args)
    if (!response.success) return null
    return { ...response.user, mmrs: response.mmrs.mmrs }
  }

  public static async getBotToken(
    botUid: string, jwt: string
  ): Promise<string | null> {
    const response = await this.get<IComm.BotTokenResponse>(
      "bot-token",
      { bot_uid: botUid, firebase_jwt: jwt }
    )
    if (!response.success) return null
    return response.bot_jwt
  }

  public static async getGameModes(): Promise<ICore.GameMode[] | null> {
    const response = await this.get<IComm.GameModeResponse>("game-mode", { all: true })
    if (!response.success) return null
    return response.game_modes
  }

  public static async getGameMode(
    id: string
  ): Promise<ICore.GameMode | null> {
    const response = await this.get<IComm.GameModeResponse>("game-mode", { id: id })
    if (!response.success) return null
    return response.game_modes[0]
  }

  public static async getUserStats(uid: string): Promise<ICore.GameModeStats[] | null> {
    const response = await this.get<IComm.UserStatsResponse>("user-stats", { uid })
    if (!response.success) return null
    return response.stats
  }

  public static async createUser(
    user: Omit<ICore.User, "last_online" | "mmrs">
  ): Promise<IComm.Response> {
    return await this.post("create-user", user)
  }

  public static async createBot(
    data: IActions.CreateBot
  ): Promise<IComm.Response<IComm.CreateBotResponse>> {
    return await this.post("create-bot", data)
  }

}

export default API