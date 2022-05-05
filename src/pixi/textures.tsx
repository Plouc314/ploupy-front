import { Loader, Texture } from 'pixi.js'

class Textures {
  static ready = false;
  static loader = new Loader();

  static avatars = [
    "bear",
    "dog",
  ]

  static load(onClomplete?: () => void) {
    if (this.ready) {
      return;
    }

    this.loader.onComplete.add(() => {
      this.ready = true;
      if (onClomplete) {
        onClomplete();
      }
    });

    this.loader.reset()
    for (const file of this.avatars) {
      this.loader.add(`/assets/textures/${file}.png`)
    }
    // start loading
    this.loader.load();
  }

  static get(name: string) {
    let path = `/assets/textures/${name}.png`;
    const texture = this.loader.resources[path].texture as Texture;
    return texture;
  }
}


export default Textures;