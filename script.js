$(function() {
    $('.start-btn').click(function(event) {
        let start = aim.targetStart.bind(aim)
        start()
        event.target.style.visibility = "hidden"
        $('.main-header').text("Difficulty 1")
    })


    let aim = {
        targetObj: $(".target"),
        pointsObj: $('.points'),
        score: 0,
        speed: 15,

        targetStart() {
            this.targetObj.addClass("target-motion target--ingame")
            this.targetObj.mousedown(() => {
                this.incrementLevel()
            })
        },

        incrementLevel() {
            this.score++
            this.pointsObj.text(`${this.score}`)
            if (this.score == 5) {
                this.changeDifficulty()
            } else if (this.score == 15) {
                this.finish()
            } else {
                this.addSpeed()
            }
        },

        addSpeed() {
            this.speed = Math.round(this.speed * 0.93 * 100) / 100
            console.log(this.speed)
            document.querySelector(".target-motion").style.animationDuration = `${this.speed}s`
        },

        changeDifficulty() {
            document.querySelector(".target-motion").style.animationName = "target-level-2"
            $(".main-header").text("Difficulty 2")
            this.targetObj.addClass("target--small")
        },

        finish() {
            $(".play-field").html("<div style='font-size: 4rem; text-align: center;'>You rock!</div>")
            $(".main-header").text("Congratulations!")
            $(".play-field").css({
                            background: 'greenyellow'})
        }

    }
})