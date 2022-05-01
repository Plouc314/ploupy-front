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