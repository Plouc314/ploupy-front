// types
import { Comm } from "../../types"

/**
 * Contains info about the current user
 */
class User {
  public static connected: boolean = false
  public static uid: string
  public static username: string
  public static email: string

  public static set(user: Comm.UserData) {
    this.connected = true
    this.uid = user.uid
    this.username = user.username
    this.email = user.email
  }
}

export default User