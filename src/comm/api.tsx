// types
import { IComm } from "../../types"

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
  ): Promise<IComm.UserData | null> {
    const response = await this.get<IComm.UserData>("user-data", args)

    if (!response.success) return null
    return response.data
  }

  public static async createUser(
    user: IComm.UserData
  ): Promise<IComm.Response> {
    return await this.post("create-user", user)
  }

}

export default API