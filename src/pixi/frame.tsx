/**
 * Store frame information
 * assigned in Pixi
 */
class Frame {
    /** Frame duration */
    public dt: number

    constructor(dt: number) {
        this.dt = dt
    }
}

export default Frame