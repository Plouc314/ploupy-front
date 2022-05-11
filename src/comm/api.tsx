// types
import { IComm } from "../../types"

/**
 * Interface to the server api
 */
namespace API {

  const API_URL: string = "http://127.0.0.1:5000/api/"

  export async function get<R extends {}>(
    endpoint: string, args?: Record<string, any>
  ): Promise<IComm.Response<R>> {

    let url = API_URL + endpoint

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

  export async function post<T extends {}, R extends {} = {}>(
    endpoint: string, body: T
  ): Promise<IComm.Response<R>> {
    const response = await fetch(
      API_URL + endpoint,
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

  export async function getUserData(
    args: { uid?: string, username?: string }
  ): Promise<IComm.UserData | null> {
    const response = await get<IComm.UserData>("user-data", args)

    if (!response.success) return null
    return response.data
  }

  export async function createUser(
    user: IComm.UserData
  ): Promise<IComm.Response> {
    return await post("create-user", user)
  }

}

export default API