// pixi
import Pixi from './app'
import GameLogic from './gamelogic';
import Sio from '../comm/sio';

class Scene {

  public static start(idx: number) {
    const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement;
    Pixi.onLoadingComplete = () => GameLogic.setup(idx)
    Pixi.run = () => {
      if (!Sio.connected) return
      GameLogic.run()
    }
    Pixi.setup(canvas)
  }
}

export default Scene