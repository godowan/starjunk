var Pixi = require("pixi.js")
var Utility = require("./Utility")

import Reference from "./Reference.js"
import Projectile from "./Projectile.js"
import Junkership from "./Junkership.js"

var trashbotTex = Pixi.Texture.fromImage(require("./images/enemy-starship.png"))

export default class Trashbot extends Pixi.Sprite {
    constructor(x, y) {
        super(trashbotTex)
        this.speed = 40
        this.position.x = x
        this.position.y = y
    }
    update(delta) {
        this.position.x -= this.speed * delta
        if (this.position.x + this.width < 0) {
            this.position.x = Reference.GAME_WIDTH
        }
        var killedBy
        game.children.forEach((toCompare) => {
            if (toCompare instanceof Projectile) {
                if (Utility.hasCollision(this, toCompare)) {
                    killedBy = toCompare //
                    toCompare.onCollision(this)
                }
            } else if (toCompare instanceof Junkership) {
                if (Utility.hasCollision(this, toCompare)) {
                    toCompare.onCollision(this)
                }
            }
        })
        if (killedBy) {
            this.onCollision(killedBy)
        }
    }

    onCollision(collidedWith) {
        game.removeChild(this)
        this.destroy()
        collidedWith.shotBy.score++
    }
}
