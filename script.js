$(function() {
    $('.start-btn').click(function(event) {
        event.target.style.visibility = "hidden"
        $('.main-header').html("Difficulty: <span class='difficulty-level'>1</span>")
        startEvents()
    })

    function startEvents() {
        let start = playfield.targetStart.bind(playfield)
        setTimeout(() => start(), 4700)

        let counter = 3
        let countdown = document.querySelector(".countdown")
        countdown.style.opacity = '1'
        setTimeout(() => {
            countdown.style.opacity = '0'
            countdown.style.zIndex = '-1'
        }, 4700)
        let countdownIteration = setInterval(() => {
            if (counter == 0) {
                $('.countdown').text("GO!")
                clearInterval(countdownIteration)
                return
            }
            $(".countdown").text(`${counter}`)
            counter--
        }, 1000)
        
    }


    let playfield = {
        targetObj: $(".target"),
        pointsObj: $('.points'),
        score: 0,
        speed: 15,
        clicks: 0,

        targetStart() {
            timer.start()
            $(".clicks").show()
            this.targetObj.addClass("target-motion target--ingame")
            this.targetObj.mousedown(() => {
                this.incrementLevel()
            })
            $(".play-field").click(() => {
                this.incrementClicks()
            })
        },

        incrementClicks() {
            if (this.clicks == 0) {
                this.offsetOfBar = document.querySelector(".clicks__amount").offsetWidth
                this.widthToRemove = document.querySelector(".clicks__amount").offsetWidth / 20
            }
            this.clicks++
            document.querySelector(".clicks__amount").style.width = this.offsetOfBar - this.widthToRemove * this.clicks + 'px'

            if (this.clicks == 10) {
                document.querySelector(".clicks__amount").style.backgroundColor = '#ff7b25'
            }    
            if (this.clicks == 20) {
                document.querySelector(".clicks").style.color = '#ff7b25'
                this.fail()
            }
            
            
        },

        incrementLevel() {
            this.score++
            this.pointsObj.text(`${this.score}`)
            if (this.score == 5) {
                this.raiseDifficulty(2)
            } else if (this.score == 10) {
                this.raiseDifficulty(3)
            } else if (this.score == 15) {
                this.win()
            } else {
                this.addSpeed()
            }
        },

        addSpeed() {
            this.speed = Math.round(this.speed * 0.93 * 100) / 100
            console.log(this.speed)
            document.querySelector(".target-motion").style.animationDuration = `${this.speed}s`
        },

        raiseDifficulty(level) {
            if (level == 2) {
                document.querySelector(".target-motion").style.animationName = "target-level-2"
                this.targetObj.addClass("target--small")
            } else if (level == 3) {
                this.showTargetInterval = setInterval(() => {
                    let targetNode = document.querySelector(".target")
                    if (targetNode.style.opacity == "0") {
                        targetNode.style.opacity = '1'
                    } else {
                        targetNode.style.opacity = "0"
                    }
                }, 500)
            }
            
            $(".difficulty-level").text(`${level}`)
            
        },

        finish() {
            timer.stop()
            clearInterval(this.showTargetInterval)
            $(".play-field").unbind()   
        },

        win() {
            this.finish()

            let playtime = timer.getPlaytime()
            $(".play-field").html(`<div class='result'>You rock!<br>Playtime:<br> <span class='points'>${playtime}</span></div>`)
            $(".main-header").text("Congratulations!")
            $(".play-field").css({
                            background: 'greenyellow'})
        },

        fail() {
            this.finish()

            $(".play-field").html("<div class='result'>Failed</div>")
            $(".play-field").css({
                background: 'tomato'
            })

        }
    }

    let timer = {
        seconds: 0,

        start() {
            this.interval = setInterval(() => this.seconds++, 1000)
        },

        stop() {
            clearInterval(this.interval)
        },

        getPlaytime() {
            let timeArr = [0]
            let seconds = this.seconds

            if (seconds > 59) {
                let minutes = Math.floor(this.seconds / 60)
                seconds %= 60
                timeArr.push(minutes)
                if (minutes > 59) {
                    let hours = Math.floor(minutes / 60)
                    minutes %= 60
                    timeArr.push(hours)
                }
            }

            timeArr[0] = seconds

            return this._getTimeString(timeArr)
        },

        _getTimeString(arr) {
            let smhStringsArray = []

            let partOfTimeStr;
            for (let i of arr) {
                partOfTimeStr = i < 10 ? `0${i}` : i.toString()
                smhStringsArray.unshift(partOfTimeStr)
            }

            return arr.length == 1 ? smhStringsArray[0] + 'sec' : smhStringsArray.join(":")
        }
    }

})