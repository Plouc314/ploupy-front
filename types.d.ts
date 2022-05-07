import React from 'react'

export type FC<T> = React.FC<React.PropsWithChildren<T>>

export namespace Firebase {
  export type User = {
    id: string
    email: string
  }

  export type Auth = {
    user: User | null
    loading: boolean
  }
}

export namespace Game {
  export type RGB = {
    r: number
    g: number
    b: number
  }

  export interface Point2D {
    x: number
    y: number
  }

  export type Dimension = Point2D
  export type Coordinate = Point2D
  export type Position = Point2D
  export type Direction = Point2D

  export interface Sprite {
    child: () => Container
  }

  export namespace Comm {
    export type PlayerState = {
      username: string
      position: Position
    }

    export type ServerState = {
      username: string
      position: Position
      score: number
      tiles: Game.Coordinate[]
    }
  }

}

export namespace Comm {
  export type Response<T> = {
    success: boolean
    msg: string
    data: T
  }

  export type UserData = {
    uid: string
    username: string
    email: string
  }
}