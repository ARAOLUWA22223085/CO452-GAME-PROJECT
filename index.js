const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
// console.log(scoreEl)

const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

var audio1 = new Audio('audio/gamesfx.mp3');
var audio2 = new Audio('audio/gameOver.mp3');
var audio3 = new Audio('audio/powerup.mp3');
var audio4 = new Audio('audio/gameOver.mp3');
var audio5 = new Audio('audio/victory.mp3');



audio1.play();
audio1.play();



class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image
    }
    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y,)

    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75
        this.openRate = 0.12
        this.rotation = 0
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow';
        c.fill()
        c.closePath
        c.restore()
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.radians < 0 || this.radians > 0.75)
            this.openRate = -this.openRate
        this.radians += this.openRate

    }
}

class Ghost {
    static speed = 3
    constructor({ position, velocity, color = 'red' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color
        this.prevCollisions = []
        this.speed = 3
        this.scared = false
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill()
        c.closePath
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white';
        c.fill()
        c.closePath
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position;
        this.radius = 8;
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white';
        c.fill()
        c.closePath
    }
}


const pellets = []

const boundaries = []

const powerUps = []

const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 11 + Boundary.width * .5,
            y: Boundary.height + Boundary.height * .5
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 7 + Boundary.width * .5,
            y: Boundary.height * 1 + Boundary.height * .5
        },
        velocity: {
            x: Ghost.speed,
            y: 0,
        },
        color: 'purple'
    }),
    new Ghost({
        position: {
            x: Boundary.width + Boundary.width * .5,
            y: Boundary.height * 11 + Boundary.height * .5
        },
        velocity: {
            x: Ghost.speed,
            y: 0,
        },
        color: 'orange'
    }),
    new Ghost({
        position: {
            x: Boundary.width * 11 + Boundary.width * .5,
            y: Boundary.height * 14 + Boundary.height * .5
        },
        velocity: {
            x: Ghost.speed,
            y: 0,
        },
        color: 'pink'
    }),

]


const player = new Player({

    position: {
        x: Boundary.width + Boundary.width * .5,
        y: Boundary.height + Boundary.height * .5
    },

    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''
let score = 0

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-',],
    ['-', '.', '-', ' ', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', ' ', '-', '.', '-',],
    ['-', '.', '-', '-', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-',],
    ['-', 'o', '.', '.', '.', 'o', '.', '.', '.', 'o', '.', '.', '.', 'o', '.', '.', '.', 'o', '-',],
    ['-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '.', '-',],
    ['-', '.', '-', '-', '.', '-', ' ', '-', '.', '-', '.', '-', ' ', '-', '.', '-', '-', '.', '-',],
    ['-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '-', '-', '-', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '.', '-', '-', '-', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '.', '-', '-', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-',],
    ['-', '.', '-', '-', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-',],
    ['-', 'o', '.', '.', '.', 'o', '.', '.', '.', 'o', '.', '.', '.', 'o', '.', '.', '.', 'o', '-',],
    ['-', '.', '-', '-', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-',],
    ['-', '.', '-', ' ', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', ' ', '-', '.', '-',],
    ['-', '.', '-', '-', '-', '.', '-', '-', '.', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-',],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-',],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',],

]

const image = new Image()
image.src = './img/wall.png'

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        // console.log(symbol)

        switch (symbol) {
            case '-':
                boundaries.push(new Boundary({
                    position: {
                        x: Boundary.width * j,
                        y: Boundary.height * i
                    },
                    image: image
                })
                )
                break
            case '.':
                pellets.push(new Pellet({
                    position: {
                        x: (Boundary.width * j) + Boundary.width / 2,
                        y: (Boundary.height * i) + Boundary.height / 2
                    }
                })
                )
                break
            case 'o':
                powerUps.push(new PowerUp({
                    position: {
                        x: (Boundary.width * j) + Boundary.width / 2,
                        y: (Boundary.height * i) + Boundary.height / 2
                    }
                })
                )
                break
        }
    })
})

function circleCollidesWithRectangle({
    circle,
    rectangle,
}) {
    const padding = Boundary.width / 2 - circle.radius - 2
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}
let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    console.log(animationId)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -5
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else { player.velocity.y = -5 }
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: +5
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else { player.velocity.y = +5 }
        }
    }

    else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -5,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else { player.velocity.x = -5 }
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: +5,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else { player.velocity.x = +5 }
        }
    }
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i]
        if (Math.hypot(ghost.position.x - player.position.x,
            ghost.position.y - player.position.y) < ghost.radius + player.radius) {

            if (ghost.scared == true) {
                // audio4.play();
                ghosts.splice(i, 1)
            }
            else {
                cancelAnimationFrame(animationId)
                console.log('you lose. Loser.')
                audio1.pause();
                audio2.play();
            }
        }
    }

    if (pellets.length === 0 || ghosts.length === 0) {
        cancelAnimationFrame(animationId)
        console.log('Oh wow, you actually won? Good job Chump.')
        audio1.pause();
        audio5.play();

    }

    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        if (Math.hypot(powerUp.position.x - player.position.x,
            powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
            // console.log('touching')

            powerUps.splice(i, 1)

            ghosts.forEach(ghost => {
                ghost.scared = true;
                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })

            score += 20;
            audio3.play();
            scoreEl.innerHTML = score;
        }

    }

    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x - player.position.x,
            pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            // console.log('touching')

            pellets.splice(i, 1)
            score += 10;
            scoreEl.innerHTML = score;
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            // console.log('we are colliding')
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()

    ghosts.forEach((ghost) => {
        ghost.update()

        const collisions = []
        boundaries.forEach((boundary) => {

            if (!collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('right')
            }

            if (!collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('left')
            }

            if (!collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('up')
            }
            if (!collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: +ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('down')
            }

        })
        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions
        }
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            // console.log('gogurt baybee')

            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            // console.log(collisions)
            // console.log(ghost.prevCollisions)

            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })
            // console.log({ pathways })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]
            // console.log({ direction })

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break;
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break;
                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break;
                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break;
            }

            ghost.prevCollisions = []
        }
    })

    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5

}


animate();

window.addEventListener('keydown', ({ key }) => {
    switch (key) {

        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break;

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break;

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break;

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break;

    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key) {

        case 'w':
            keys.w.pressed = false
            break;

        case 'a':
            keys.a.pressed = false
            break;

        case 's':
            keys.s.pressed = false
            break;

        case 'd':
            keys.d.pressed = false
            break;

    }
})

