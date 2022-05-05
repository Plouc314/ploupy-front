
export interface KeyState {
  up: boolean
  down: boolean
}

export interface KeyHandler {
  onDown: (() => void)[]
  onUp: (() => void)[]
  onPress: (() => void)[]
}

class Keyboard {
  private static readonly ESCAPE = "Escape"
  private static handlers: Record<string, KeyHandler>
  private static states: Record<string, KeyState>
  public static active: boolean = false

  public static setup() {
    window.addEventListener("keydown", (e) => { this.onKeyDown(e) }, false)
    window.addEventListener("keyup", (e) => { this.onKeyUp(e) }, false)
    this.handlers = {}
    this.states = {}
    this.active = true
  }

  public static reset() {
    window.removeEventListener("keydown", (e) => { this.onKeyDown(e) })
    window.removeEventListener("keyup", (e) => { this.onKeyUp(e) })
    this.handlers = {}
    this.states = {}
    this.active = false
  }

  public static get(key: string): KeyState {
    return this.states[key]
  }

  private static onKeyDown(e: KeyboardEvent) {
    if (!this.active) return

    if (e.key === this.ESCAPE) {
      this.active = false
    }

    if (!(e.key in this.states)) return

    const state = this.states[e.key]

    if (state.down) return

    state.down = true
    state.up = false

    if (e.key in this.handlers) {
      const handler = this.handlers[e.key]
      handler.onDown.forEach(cb => cb())
    }
    e.preventDefault()
  }

  private static onKeyUp(e: KeyboardEvent) {
    if (!this.active) return

    if (!(e.key in this.states)) return

    const state = this.states[e.key]

    if (state.up) return

    state.down = false
    state.up = true

    if (e.key in this.handlers) {
      const handler = this.handlers[e.key]
      handler.onUp.forEach(cb => cb())
      handler.onPress.forEach(cb => cb())
    }
    e.preventDefault()
  }

  public static listen(key: string | string[]) {
    if (typeof key === "string") {
      key = [key]
    }
    for (const k of key) {
      this.states[k] = {
        down: false,
        up: true,
      }
    }
  }

  public static addOnDown(key: string, cb: () => void) {
    this.listen(key)
    if (!(key in this.handlers)) {
      this.handlers[key] = {
        onDown: [],
        onUp: [],
        onPress: [],
      }
    }
    this.handlers[key].onDown.push(cb)
  }

  public static addOnUp(key: string, cb: () => void) {
    this.listen(key)
    if (!(key in this.handlers)) {
      this.handlers[key] = {
        onDown: [],
        onUp: [],
        onPress: [],
      }
    }
    this.handlers[key].onUp.push(cb)
  }

  public static addOnPress(key: string, cb: () => void) {
    this.listen(key)
    if (!(key in this.handlers)) {
      this.handlers[key] = {
        onDown: [],
        onUp: [],
        onPress: [],
      }
    }
    this.handlers[key].onPress.push(cb)
  }
}

export default Keyboard