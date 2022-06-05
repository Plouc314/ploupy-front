// react
import { createContext, useContext, useEffect, useState } from "react";

// types
import { FC, IModel } from "../../types";

export type IUseGameData = {
  gameData: IModel.Game | null
  setGameData: (data: IModel.Game | null) => void
}

function useGameDataInternal(): IUseGameData {
  const [gameData, setGameData] = useState<IModel.Game | null>(null)

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
