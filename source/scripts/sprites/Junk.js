var Pixi = require("pixi.js")
var Utility = require("scripts/data/Utility")

import Reference from "scripts/data/Reference.js"
import Junkership from "scripts/sprites/Junkership.js"
import Trashbot from "scripts/sprites/Trashbot.js"
import Score from "scripts/ui/Score.js"
import Sound from "scripts/layers/Sound.js"
import * as WeaponList from "scripts/PowerUp.js"

export class Junk extends Pixi.Sprite {
    constructor(x, y) {
        super(PIXI.loader.resources.junk.texture)
        this.position.x = x
        this.position.y = y
        this.spawnTime = Date.now()
        Junk.Inventory.push(this)
    }

    update(delta) {
        if (Date.now() - this.spawnTime >= Reference.TIME_TO_DESPAWN * 1000) {
            this.destroy()
        } else {
            for (var i = 0; i < Junkership.Inventory.length; i++) {
                var junkership = Junkership.Inventory[i]
                if (Utility.hasCollision(this, junkership)) {
                    Sound.playSFX("getjunk")
                    junkership.score.incrementScore()
                    var weaponKeys = Junk.weaponKeys.slice(0)
                    weaponKeys.splice(weaponKeys.indexOf(junkership.powerUp.constructor.name), 1)
                    var weaponIndex = Utility.randomNumber(0, weaponKeys.length - 1)
                    var powerUp = WeaponList[weaponKeys[weaponIndex]]
                    junkership.changePowerUp(new powerUp(junkership))
                    this.destroy()
                    break
                }
            }
        }
    }

    destroy() {
        Junk.Inventory.splice(Junk.Inventory.indexOf(this), 1)
        game.removeChild(this)
        super.destroy()
    }

    static weaponKeys = Object.keys(WeaponList)
}

Junk.Inventory = []
