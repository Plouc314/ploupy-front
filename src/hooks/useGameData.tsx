// react
import { createContext, useContext, useEffect, useState } from "react";

// types
import { FC, IGame } from "../../types";

export type IUseGameData = {
  gameData: IGame.Game | null
  setGameData: (data: IGame.Game | null) => void
}

function useGameDataInternal(): IUseGameData {
  const [gameData, setGameData] = useState<IGame.Game | null>(null)

  return { gameData, setGameData }
}


const gameDataContext = createContext<IUseGameData>({} as IUseGameData)

export interface GameDataProviderProps { }

export const GameDataProvider: FC<GameDataProviderProps> = (props) => {
  const values = useGameDataInternal()
  return <gameDataContext.Provider value={values}>{props.children}</gameDataContext.Provider>
}


export function useGameData() {
  return useContext(gameDataContext)
}
