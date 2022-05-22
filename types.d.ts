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
    factory_price: number
    building_occupation_min: number
    max_occupation: number
    probe_speed: number
  }

  export type Player = {
    username: string
    money: number
    score: number
    factories: Factory[]
    probes: Probe[]
  }

  export type PlayerState = {
    username: string
    money?: number
    score?: number
    factories: FactoryState[]
    probes: ProbeState[]
  }

  export type Factory = {
    id: string
    coord: IGame.Coordinate
    alive: boolean
  }

  export type FactoryState = Loose<Factory, "id">

  export type Probe = {
    id: string
    pos: IGame.Position
    alive: boolean
    target: IGame.Coordinate
  }

  export type ProbeState = Loose<Probe, "id">

  export type Tile<K = string> = {
    id: string
    coord: IGame.Coordinate
    owner: K | null
    occupation: number
  }

  export type TileState<K = string> = Loose<Tile<K>, "id">

  export type Map<K = string> = {
    tiles: Tile<K>[]
  }

  export type MapState<K = string> = {
    tiles?: TileState<K>[]
  }

  export type Game<K = string> = {
    config: GameConfig
    map: Map<K>
    players: Player[]
  }

  export type GameState<K = string> = {
    config: GameConfig
    map?: MapState<K>
    players: PlayerState[]
  }

  export type ActionBuildFactory = {
    coord: IGame.Coordinate
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
    factory: IModel.Factory
  }

  export type BuildProbeResponse = {
    username: string
    probe: IModel.Probe
  }
}


export type RGB = {
  r: number
  g: number
  b: number
}