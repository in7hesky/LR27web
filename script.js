$(function() {
    $('.start-btn').click(function(event) {
        event.target.style.visibility = "hidden"
        $('.main-header').html(`Difficulty: <span class='difficulty-level'>${levelTracker.levelNames[0]}</span>`)
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
        clicks: 0,

        targetStart() {
            timer.start()
            $(".clicks").show()
            this.targetObj.addClass("target-motion target--ingame")
            $(".play-field").mousedown(() => {
                this.incrementClicks()
            })
            this.targetObj.mousedown(() => {
                levelTracker.incrementLevel()
            })
            
        },

        incrementClicks() {
            this.clicks++
            if (this.clicks == 1) {
                this.offsetOfBar = document.querySelector(".clicks__amount").offsetWidth
                this.widthToRemove = document.querySelector(".clicks__amount").offsetWidth / 20
            }
            document.querySelector(".clicks__amount").style.width = this.offsetOfBar - this.widthToRemove * this.clicks + 'px'

            if (this.clicks == 10) {
                document.querySelector(".clicks__amount").style.backgroundColor = '#ff7b25'
            }    
            console.log(this.clicks)
            if (this.clicks == 20) {
                document.querySelector(".clicks").style.color = '#ff7b25'
                this.fail()
            }
            
        },

        finish() {
            timer.stop()
            clearInterval(levelTracker.showTargetInterval)
            clearInterval(levelTracker.showCrackenInterval)
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

            document.querySelector(".play-field").style.animation = 'none'
            $(".play-field").html("<div class='result'>Failed</div>")
            $(".play-field").css({
                background: 'tomato'
            })

        }
    }

    let levelTracker = {
        levelNames: ['easy', 'medium', 'hard', 'nightmare'],
        score: 0,
        speed: 15,
        pointsObj: $('.points'),

        incrementLevel() {
            this.score++
            this.pointsObj.text(`${this.score}`)
            if (this.score == 5) {
                this.raiseDifficulty(2)
            } else if (this.score == 10) {
                this.addSpeed()
                this.raiseDifficulty(3)
            } else if (this.score == 14) {
                if (playfield.clicks != 19) {
                    console.log(playfield.clicks)
                    this.raiseDifficulty(4)
                }
                
            }
              else if (this.score == 15) {
                document.querySelector(".play-field").style.animation = "none"
                playfield.win()
            } else {
                this.addSpeed()
            }
        },

        addSpeed() {
            this.speed = Math.round(this.speed * 0.93 * 100) / 100
            //console.log(this.speed)
            document.querySelector(".target-motion").style.animationDuration = `${this.speed}s`
        },

        raiseDifficulty(level) {
            if (level == 2) {
                document.querySelector(".target-motion").style.animationName = "target-level-2"
                $('.target').addClass("target--small")
            } else if (level == 3) {
                this.showTargetInterval = setInterval(() => {
                    let targetNode = document.querySelector(".target")
                    if (targetNode.style.opacity == "0") {
                        targetNode.style.opacity = '1'
                    } else {
                        targetNode.style.opacity = "0"
                    }
                }, 500)
            } else if (level == 4) {
                this.releaseCutscene()
            }
            
            $(".difficulty-level").text(`${this.levelNames[level - 1]}`)
            
        },

        releaseCutscene() {
            timer.stop()
            $('.play-field').off()

            document.querySelector(".target").style.visibility = 'hidden'
            $(".play-field").addClass("play-field--collapse")
            setTimeout(() => {
                document.querySelector(".cracken-alert").style.opacity = '1'
                document.querySelector(".cracken-alert").style.animationName = 'cracken-shout'
                setTimeout(() => {
                    document.querySelector('.cracken-alert').style.opacity = '0'
                    document.querySelector('.play-field').style.animation = 'boss-background 4s steps(1) infinite'
                    this.releaseCracken()
                }, 8500)
            }, 8000)
        },

        releaseCracken() {
            timer.start()
            $(".play-field").mousedown(() => {
                playfield.incrementClicks()
            })

            document.querySelector(".target").style.visibility = 'visible'
            let cracken = document.querySelector(".target").cloneNode()
            cracken.style.animationDirection = 'alternate-reverse'
            
            this.showCrackenInterval = setInterval(() => {
                if (cracken.style.opacity == "0") {
                    if (cracken.style.backgroundColor == 'tomato') {
                        cracken.style.backgroundColor = 'yellow'
                    } else {
                        cracken.style.backgroundColor = 'tomato'
                    }
                    cracken.style.opacity = '1'
                } else {
                    cracken.style.opacity = "0"
                }
            }, 500)
            document.querySelector(".play-field").appendChild(cracken)
        }
    }

    let timer = {
        seconds: 0,

        start() {
            this.interval = setInterval(() => {
                this.seconds++
                }, 1000)
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