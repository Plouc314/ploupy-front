// types
import { IComm } from "../../types"

/**
 * Interface to the server api
 */
class API {

  private static readonly API_URL: string = "http://127.0.0.1:8000/api/"

  public static async get<R extends {}>(
    endpoint: string, args?: Record<string, any>
  ): Promise<IComm.Response<R>> {

    let url = this.API_URL + endpoint

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
      this.API_URL + endpoint,
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