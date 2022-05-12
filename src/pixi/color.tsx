// types
import { IGame } from '../../types'

class Color {
  private raw: number

  constructor(raw: number) {
    this.raw = raw
  }

  public static fromRgb(r: IGame.RGB | number, g?: number, b?: number): Color {
    if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
      r = { r, g, b }
    }
    return new Color(Color.toHex(r as IGame.RGB))
  }

  public withDiff(r: IGame.RGB | number, g?: number, b?: number): Color {
    if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
      r = { r, g, b }
    }
    const diff = r as IGame.RGB
    const rgb = this.rgb()
    const clamp = (v: number, min: number, max: number) => {
      return Math.max(Math.min(v, max), min)
    }
    return Color.fromRgb(
      clamp(rgb.r + diff.r, 0, 255),
      clamp(rgb.g + diff.g, 0, 255),
      clamp(rgb.b + diff.b, 0, 255),
    )
  }

  private static toRgb(raw: number): IGame.RGB {
    return {
      r: (raw >> 16) & 255,
      g: (raw >> 8) & 255,
      b: raw & 255,
    }
  }

  private static toHex(rgb: IGame.RGB): number {
    return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
  }

  public hex(): number {
    return this.raw
  }

  public rgb(): IGame.RGB {
    return Color.toRgb(this.raw)
  }

  public toString(): string {
    const { r, g, b } = Color.toRgb(this.raw)
    return `rgb(${r}, ${g}, ${b})`
  }
}

export default Color