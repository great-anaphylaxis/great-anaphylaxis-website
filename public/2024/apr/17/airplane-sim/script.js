var canvas = document.getElementById("canvas");
var counter = document.getElementById("counter");
var counter2 = document.getElementById("counter2");
var play = document.getElementById("play");

var start = false;

var towers = [];
var player = {};

var score = 0;
var highscore = getHighScore()
var speed = 3;

var allowJump = true;
var jumped = false;


function createTwinTower() {
    let gapSize = 200;

    let gapStart = random(100, 600 - gapSize - 25);
    let gapEnd = gapStart + gapSize;

    createTower(400, 0, 100, gapStart);

    createTower(400, gapEnd, 100, 800 - gapEnd);
}

function createTower(x, y, width, height) {
    let e = document.createElement("div");
    e.classList.add("tower");

    let s = e.style;
    let o = {
        e: e,
        s: s,
        x: x,
        y: y,
        width: width,
        height: height,
        passed: false,
    }

    s.backgroundColor = "black";
    s.position = "absolute";
    s.top = o.y + "px";
    s.left = o.x + "px";
    s.width = o.width + "px";
    s.height = o.height + "px";

    canvas.appendChild(e);
    towers.push(o);
    return e;
}

function createPlayer() {
    let e = document.createElement("div");
    let s = e.style;
    e.id = "player";
    player = {
        e: e,
        s: s,
        x: 50,
        y: 200,
        width: 125,
        height: 55,
        velocityY: 0,
        accelerationY: 0.2,
    }
    
    s.position = "absolute";
    s.top = player.y + "px";
    s.left = player.x + "px";
    s.width = player.width + "px";
    s.height = player.height + "px";
    s.zIndex = "2";

    canvas.appendChild(e);
    return e;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function passedTower() {
    score += 0.5;

    counter.innerText = score;
}

function gameOver() {
    if (score > highscore) {
        window.localStorage.setItem("highScore", score);
    }
    window.location.reload();
}

function getHighScore() {
    return parseFloat(window.localStorage.getItem("highScore")) || 0;
}

function mainloop() {
    for (let i = 0; i < towers.length; i++) {
        let tower = towers[i];

        tower.x -= speed;

        tower.s.left = tower.x + "px";

        
        if (tower.x < -200) {
            tower.e.remove();
        }

        if (tower.passed == false) {
            if (player.x > tower.x + tower.width) {
                tower.passed = true;
                passedTower()
            }
        }

        if (player.x < tower.x + tower.width && player.x + player.width > tower.x &&
             player.y < tower.y + tower.height && player.height + player.y > tower.y) {
                gameOver()
        }
    }

    if (player.y > 600 || player.y + player.height < 0) {
        gameOver()
    }

    if (jumped) {
        jumped = false;

        player.velocityY = -5.5;
    }

    player.velocityY += player.accelerationY;

    player.y += player.velocityY;

    player.s.top = player.y + "px";

    if (Math.sign(player.velocityY) == 1) {
        player.s.transform = "rotate(10deg)";
    }

    else if (Math.sign(player.velocityY) == -1) {
        player.s.transform = "rotate(-10deg)"
    }
}

function towerspawn() {
    createTwinTower();
}

function mainevents() {
    window.addEventListener("keydown", e => {
        if (e.key == " " && allowJump) {
            jumped = true
            allowJump = false;
        }
    })

    window.addEventListener("keyup", e => {
        if (e.key == " ") {
            allowJump = true;
        }
    })

    window.addEventListener("touchstart", e => {
        if (allowJump) {
            jumped = true
            allowJump = false;
        }
    })

    window.addEventListener("touchend", e => {
        allowJump = true;
    })

    window.addEventListener("mousedown", e => {
        if (allowJump) {
            jumped = true
            allowJump = false;
        }
    })

    window.addEventListener("mouseup", e => {
        allowJump = true;
    })
}

function entryevents() {
    window.addEventListener("keydown", e => {
        if (e.key == " " && start == false) {
            start = true;
            main()
        }
    });

    window.addEventListener("touchstart", e => {
        if (start == false) {
            start = true;
            main()
        }
    });

    window.addEventListener("mousedown", e => {
        if (start == false) {
            start = true;
            main()
        }
    });
}


function main() {
    play.remove();
    setInterval(mainloop, 20)
    setInterval(towerspawn, random(3250, 3750))

    mainevents()

    createPlayer()
    let audio = new Audio('./audio/erika_m.mp3');
    audio.play();
}

function entry() {
    counter2.innerText = "Highscore: " + highscore;
    entryevents()
}   

entry()