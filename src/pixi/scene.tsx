// pixi
import Pixi from './app'
import GameLogic from './gamelogic';
import Sio from '../comm/sio';

class Scene {

  public static start() {
    const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement;
    Pixi.onLoadingComplete = () => GameLogic.setup()
    Pixi.setup(canvas)
  }
}

export default Scene