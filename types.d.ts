import React from 'react'

export type FC<T> = React.FC<React.PropsWithChildren<T>>

export type Loose<T, K extends keyof T> = Partial<T> & Pick<T, K>

/**Store a date, but in a string */
export type DateLike = string

export namespace Firebase {
  export type User = ICore.User & {
    connected: boolean
    jwt: string
  }

  export type Auth = {
    user: User
    loading: boolean
  }
}

export namespace IGame {

  export interface Point2D {
    x: number
    y: number
  }

  export type Dimension = Point2D
  export type Coordinate = Point2D
  export type Position = Point2D
  export type Direction = Point2D

  export type ID = string

  export interface Sprite {
    update: (dt: number) => void
    child: () => Container
  }

  /** Unit: pixel */
  export type ContextSizes = {
    /**Dimension of the map */
    dimMap: IGame.Dimension
    tile: number
    factory: number
    turret: number
    probe: number
    ui: ContextUISizes
  }

  export type ContextUISizes = {
    /** Start position of the ui */
    x: number
    /** Global height of the ui */
    height: number
    /** Global width of the ui */
    width: number
    /** size of sprite that may be displayed next to the cursor */
    cursor: number
  }

  export type Player = {
    username: string
    money: number
    death: string | null
    income: number
    factories: Factory[]
    turrets: Turret[]
    probes: Probe[]
  }

  export type PlayerState = {
    username: string
    money: number | null
    death: string | null
    income: number | null
    factories: FactoryState[]
    turrets: TurretState[]
    probes: ProbeState[]
  }

  export type Factory = {
    id: string
    coord: IGame.Coordinate
    death: string | null
  }

  export type FactoryState = {
    id: string
    coord: IGame.Coordinate | null
    death: string | null
  }

  export type Turret = {
    id: string
    coord: IGame.Coordinate
    death: string | null
    shot_id: string | null
  }

  export type TurretState = {
    id: string
    coord: IGame.Coordinate | null
    death: string | null
    shot_id: string | null
  }

  export type Probe = {
    id: string
    pos: IGame.Position
    death: string | null
    target: IGame.Coordinate
  }

  export type ProbeState = {
    id: string
    pos: IGame.Position | null
    death: string | null
    target: IGame.Coordinate | null
  }

  export type Tile<K = string> = {
    id: string
    coord: IGame.Coordinate
    /** No owner is defined as an empty string "" */
    owner: K | undefined
    occupation: number
  }

  export type TileState<K = string> = {
    id: string
    coord: IGame.Coordinate | null
    owner: K | undefined | null
    occupation: number | null
  }

  export type Map<K = string> = {
    tiles: Tile<K>[]
  }

  export type MapState<K = string> = {
    tiles: TileState<K>[] | null
  }

  export type Game<K = string> = {
    config: GameConfig
    map: Map<K>
    players: Player[]
  }

  export type GameState<K = string> = {
    config: GameConfig | null
    map: MapState<K> | null
    players: PlayerState[]
  }

  export type GamePlayerStats = {
    username: string
    money: number[]
    occupation: number[]
    factories: number[]
    turrets: number[]
    probes: number[]
  }

}

export namespace ICore {

  export type User = {
    uid: string
    username: string
    email: string
    avatar: string
    joined_on: DateLike
    last_online: DateLike
    /**
     * Current MMRs of user in all game modes
     * ID: game mode id
     */
    mmrs: Record<IGame.ID, number>
  }

  /**
   * User as of UserManager in backend
   * Represents user + metadata
   */
  export type ManUser = {
    user: User
    connected: boolean
  }

  /**
   * User as of QueueManager in backend
   * Represents queue state
   */
  export type ManQueue = {
    qid: IGame.ID
    active: boolean
    gmid: str
    users: User[]
  }

  /**
   * User as of GameManager in backend
   * Represents game metadata
   */
  export type ManGame = {
    gid: string
    active: boolean
    gmid: string
    users: User[]
  }

  export type GameMode = {
    id: string
    name: string
    config: GameConfig
  }

  export type GameModeStats = {
    mode: GameMode
    scores: number[]
    dates: string[]
    mmr_hist: number[]
  }

  export type GameConfig = {
    dim: IGame.Coordinate
    n_player: number
    initial_money: number
    initial_n_probes: number
    base_income: number
    building_occupation_min: number
    factory_price: number
    factory_max_probe: number
    factory_build_probe_delay: number
    max_occupation: number
    probe_speed: number
    probe_price: number
    probe_claim_delay: number
    probe_maintenance_costs: number
    turret_price: number
    turret_fire_delay: number
    turret_scope: number
    turret_maintenance_costs: number
    income_rate: number
    deprecate_rate: number
  }

}

export namespace IActions {

  export type CreateQueue = {
    gmid: string
  }

  export type JoinQueue = {
    qid: IGame.ID
  }

  export type LeaveQueue = {
    qid: IGame.ID
  }

  export type GameState = {
    gid: IGame.ID
  }

  export type ResignGame = {

  }

  export type BuildFactory = {
    coord: IGame.Coordinate
  }

  export type BuildTurret = {
    coord: IGame.Coordinate
  }

  export type MoveProbes = {
    ids: string[]
    target: IGame.Coordinate
  }

  export type ExplodeProbes = {
    ids: string[]
  }

  export type ProbesAttack = {
    ids: string[]
  }
}

export namespace IComm {


  export type Response<T extends {} = {}> = T & {
    success: boolean
    msg: string
  }

  export type UserResponse = {
    user: ICore.User
    mmrs: { mmrs: Record<IGame.ID, number> }
  }

  export type GameModeResponse = {
    game_modes: ICore.GameMode[]
  }

  export type UserStatsResponse = {
    stats: ICore.GameModeStats[]
  }

  export type UserManagerState = {
    users: ICore.ManUser[]
  }

  export type QueueManagerState = {
    queues: ICore.ManQueue[]
  }

  export type GameManagerState = {
    games: ICore.ManGame[]
  }

  export type StartGameResponse = {
    gid: string
  }

  export type GameResultResponse = {
    ranking: ICore.User[]
    stats: ICore.GamePlayerStats[]
    mmrs: number[]
    mmr_diffs: number[]
  }
}

export namespace IUI {
  export type AlignX = "left" | "right"
  export type AlignY = "top" | "bottom"

  export type Dimension = {
    width: number
    height: number
  }

}

export type RGB = {
  r: number
  g: number
  b: number
}