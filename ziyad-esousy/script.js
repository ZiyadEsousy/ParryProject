const parrySound = new Audio("parry.mp3");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// how many lives the player starts with
let lives = 3;

// the position of the player in the canvas
const player = { x: 50, y: 250, width: 80, height: 80, parry: false };

// the speed the arrows move with
let arrows = [];
let arrowSpeed = 3;

// load images for the player and arrows
const playerImg = new Image();
playerImg.src = "sekiro_standing.png";

const playerParryImg = new Image();
playerParryImg.src = "sekiro_parry.png";

const arrowImg = new Image();
arrowImg.src = "arrow.png";

// the position of the arrows in the canvas and the rate of their spawn
setInterval(() => {
    arrows.push({ x: canvas.width, y: 280, width: 60, height: 20 }); // adjust y so it hits player
}, 2000);

// listen for parry (spacebar) and play a sound effect when parrying
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        player.parry = true;
        parrySound.play(); // plays the ting sound
        setTimeout(() => player.parry = false, 200); // removes the parry stance after a set time
    }
});

// the loop of the entire game
function gameLoop() {
    // refreshes the canvas so images don't stack on top of each other
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // give the player an image (parry or normal stance)
    ctx.drawImage(player.parry ? playerParryImg : playerImg, player.x, player.y, player.width, player.height);

    // give the arrows and image and a speed
    for (let i = arrows.length - 1; i >= 0; i--) {
        const arrow = arrows[i];
        arrow.x -= arrowSpeed;
        ctx.drawImage(arrowImg, arrow.x, arrow.y, arrow.width, arrow.height);

        // detects when the arrows collide with the player
        if (
            arrow.x < player.x + player.width &&
            arrow.x + arrow.width > player.x &&
            arrow.y < player.y + player.height &&
            arrow.y + arrow.height > player.y
        ) {
            if (!player.parry) {
                lives--;
                document.getElementById("status").textContent = `Lives: ${lives} ❤️`;
            }
            arrows.splice(i, 1); // remove arrow when colliding with the player
        } else if (arrow.x < 0) {
            arrows.splice(i, 1); // remove arrow if it goes offscreen
        }
    }

    // game over
    if (lives <= 0) {
        alert("GAME OVER 💀");
        document.location.reload();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();