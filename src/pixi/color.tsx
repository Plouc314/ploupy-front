// types
import { Game } from '../../types'

class Color {
    private raw: number

    constructor(raw: number) {
        this.raw = raw
    }

    public static fromRgb(r: Game.RGB | number, g?: number, b?: number): Color {
        if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
            r = { r, g, b }
        }
        return new Color(Color.toHex(r as Game.RGB))
    }

    private static toRgb(raw: number): Game.RGB {
        return {
            r: (raw >> 16) & 255,
            g: (raw >> 8) & 255,
            b: raw & 255,
        }
    }

    private static toHex(rgb: Game.RGB): number {
        return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    }

    public hex(): number {
        return this.raw
    }

    public rgb(): Game.RGB {
        return Color.toRgb(this.raw)
    }

    public toString(): string {
        const { r, g, b } = Color.toRgb(this.raw)
        return `rgb(${r}, ${g}, ${b})`
    }
}

export default Color