import React from 'react'

export type FC<T> = React.FC<React.PropsWithChildren<T>>

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
  }

  export type Player = {
    username: string
    money: number
    score: number
    factories: Factory[]
    probes: Probe[]
  }

  export type Factory = {
    coord: IGame.Coordinate
  }

  export type Probe = {
    pos: IGame.Position
  }

  export type Game = {
    config: GameConfig
    players: Player[]
  }

  export type ActionBuild = {
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

  export type ActionBuildResponse = {
    username: string
    factory: IModel.Factory
  }
}


export type RGB = {
  r: number
  g: number
  b: number
}