import React from 'react'

export type FC<T> = React.FC<React.PropsWithChildren<T>>

export type Loose<T, K extends keyof T> = Partial<T> & Pick<T, K>


export namespace Firebase {
  export type User = {
    connected: boolean
    uid: string
    username: string
    email: string
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

}

export namespace IModel {

  export type User = {
    uid: string
    username: string
    email: string
  }

  export type GameConfig = {
    dim: IGame.Coordinate
    initial_money: number
    initial_n_probes: number
    base_income: number
    factory_price: number
    factory_max_probe: number
    factory_occupation_min: number
    factory_build_probe_delay: number
    max_occupation: number
    probe_speed: number
    probe_price: number
    probe_maintenance_costs: number
    turret_price: number
    turret_fire_delay: number
    turret_scope: number
    income_rate: number
    deprecate_rate: number
  }

  /** Unit: pixel */
  export type ContextSizes = {
    dim: IGame.Dimension
    tile: number
    factory: number
    turret: number
    probe: number
    ui: ContextUISizes
  }

  export type ContextUISizes = {
    /** Global height of the ui */
    height: number
    /** Global width of the ui */
    width: number
  }

  export type Player = {
    username: string
    money: number
    score: number
    factories: Factory[]
    turrets: Turret[]
    probes: Probe[]
  }

  export type PlayerState = {
    username: string
    money: number | null
    score: number | null
    factories: FactoryState[]
    turrets: TurretState[]
    probes: ProbeState[]
  }

  export type Factory = {
    id: string
    coord: IGame.Coordinate
    alive: boolean
  }

  export type FactoryState = {
    id: string
    coord: IGame.Coordinate | null
    alive: boolean | null
  }

  export type Turret = {
    id: string
    coord: IGame.Coordinate
    alive: boolean
  }

  export type TurretState = {
    id: string
    coord: IGame.Coordinate | null
    alive: boolean | null
  }

  export type Probe = {
    id: string
    pos: IGame.Position
    alive: boolean
    target: IGame.Coordinate
  }

  export type ProbeState = {
    id: string
    pos: IGame.Position | null
    alive: boolean | null
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
    config: GameConfig
    map: MapState<K> | null
    players: PlayerState[]
  }

  export type ActionBuildFactory = {
    coord: IGame.Coordinate
  }

  export type ActionBuildTurret = {
    coord: IGame.Coordinate
  }

  export type ActionMoveProbes = {
    ids: string[]
    targets: IGame.Coordinate[]
  }

  export type ActionExplodeProbes = {
    ids: string[]
  }

  export type ActionProbesAttack = {
    ids: string[]
  }
}

export namespace IComm {

  export type Response<T extends {} = {}> = T & {
    success: boolean
    msg: string
  }

  export type UserResponse = {
    user: IModel.User
  }

  export type BuildFactoryResponse = {
    username: string
    money: number
    factory: IModel.Factory
  }

  export type BuildTurretResponse = {
    username: string
    money: number
    turret: IModel.Turret
  }

  export type BuildProbeResponse = {
    username: string
    money: number
    probe: IModel.Probe
  }

  export type TurretFireProbeResponse = {
    username: string
    turret_id: IGame.ID
    probe: IModel.ProbeState
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