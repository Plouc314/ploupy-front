// pixi.js
import { Sprite, Graphics } from 'pixi.js';
import { GlowFilter, BloomFilter } from 'pixi-filters';

// react 
import { FC, useState, useEffect } from 'react';

// pixi
import Pixi from './app'
import Textures from './textures'
import Keyboard from './keyboard'
import Player from './player';
import Map from './map';
import Color from './color';
import GameLogic from './gamelogic';

interface SceneProps {
}

const Scene: FC<SceneProps> = () => {

  useEffect(() => {
    const canvas = document.getElementById("PixiCanvas") as HTMLCanvasElement;
    Pixi.onLoadingComplete = () => GameLogic.setup()
    Pixi.run = () => GameLogic.run()
    Pixi.setup(canvas);
  }, []);

  return <canvas id="PixiCanvas" />
}

export default Scene;