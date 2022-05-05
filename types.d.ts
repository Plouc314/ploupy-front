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

  export type Dimension = {
    x: number
    y: number
  }

  export type Coordinate = {
    x: number
    y: number
  }

  export type Position = {
    x: number
    y: number
  }

  export interface Sprite {
    child: () => Container
  }
}