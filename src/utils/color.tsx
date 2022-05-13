// types
import { RGB } from '../../types'

class Color {
  private raw: number

  constructor(raw: number) {
    this.raw = raw
  }

  private static handleArgs(r: RGB | number, g?: number, b?: number): RGB {
    if (typeof r === "number") {
      if (typeof g === "number" && typeof b === "number") {
        return { r, g, b }
      } else {
        return { r: r, g: r, b: r }
      }
    }
    return r
  }

  public static fromRgb(r: RGB | number, g?: number, b?: number): Color {
    const c = this.handleArgs(r, g, b)
    return new Color(Color.toHex(c))
  }

  public withDiff(r: RGB | number, g?: number, b?: number): Color {
    const diff = Color.handleArgs(r, g, b)
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

  private static toRgb(raw: number): RGB {
    return {
      r: (raw >> 16) & 255,
      g: (raw >> 8) & 255,
      b: raw & 255,
    }
  }

  private static toHex(rgb: RGB): number {
    return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
  }

  public hex(): number {
    return this.raw
  }

  public rgb(): RGB {
    return Color.toRgb(this.raw)
  }

  public toString(): string {
    const { r, g, b } = Color.toRgb(this.raw)
    return `rgb(${r}, ${g}, ${b})`
  }
}

export default Color