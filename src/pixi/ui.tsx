// pixijs
import { Container, Text, Graphics } from 'pixi.js'

// types
import { Game } from '../../types'

// pixi
import Color from './color'
import GameLogic from './game'

class UI implements Game.Sprite {
    public static readonly SCORE_WIDTH = 100
    private container: Container
    private bg: Graphics
    private scores: Text[]

    constructor(width: number) {
        this.container = new Container()
        this.bg = new Graphics()
        this.bg.beginFill(Color.fromRgb(255, 255, 255).hex())
        this.bg.drawRect(0, 0, width, 50)
        this.container.addChild(this.bg)

        this.scores = []
        for (let i = 0; i < GameLogic.players.length; i++) {
            const text = new Text("")
            text.position.x = i * UI.SCORE_WIDTH
            this.container.addChild(text)
            this.scores.push(text)
        }
    }

    public update() {
        for (let i = 0; i < GameLogic.players.length; i++) {
            const player = GameLogic.players[i]
            const text = this.scores[i]
            text.style.fill = player.textColor().hex()
            text.text = `${player.username}: ${player.score}`
        }
    }

    public child(): Container {
        return this.container
    }
}

export default UI