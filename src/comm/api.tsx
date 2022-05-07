// types
import { Comm } from "../../types"

/**
 * Interface to the server api
 */
class API {

  public static readonly API_URL: string = "http://127.0.0.1:5000/api"

  private static async get<R extends {}>(
    endpoint: string, args?: Record<string, any>
  ): Promise<Comm.Response<R>> {

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

  private static async post<T extends {}, R extends {} = {}>(
    endpoint: string, body: T
  ): Promise<Comm.Response<R>> {
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

  public static async getUserData(uid: string): Promise<Comm.UserData | null> {
    const response = await this.get<Comm.UserData>("/user-data", { uid })

    if (!response.success) return null
    return response.data
  }

}

export default API