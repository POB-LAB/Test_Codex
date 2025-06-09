const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
const width = canvas.width / tileSize;
const height = canvas.height / tileSize;

let score = 0;
let gameOver = false;

const scoreDiv = document.getElementById('score');
const statusDiv = document.getElementById('status');

const board = [];
for (let y = 0; y < height; y++) {
    board[y] = [];
    for (let x = 0; x < width; x++) {
        if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
            board[y][x] = 1; // wall
        } else {
            board[y][x] = 0; // pellet
        }
    }
}

const pacman = { x: 1, y: 1, dx: 0, dy: 0 };
const ghost = { x: width - 2, y: height - 2, dx: 0, dy: 0 };

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = board[y][x];
            if (cell === 1) {
                ctx.fillStyle = '#444';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (cell === 0) {
                ctx.fillStyle = '#ff0';
                ctx.beginPath();
                ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
    // draw pacman
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fill();

    // draw ghost
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
}

function update() {
    if (gameOver) return;

    // move pacman
    const nextX = pacman.x + pacman.dx;
    const nextY = pacman.y + pacman.dy;
    if (board[nextY][nextX] !== 1) {
        pacman.x = nextX;
        pacman.y = nextY;
    }
    if (board[pacman.y][pacman.x] === 0) {
        board[pacman.y][pacman.x] = 2; // eaten
        score += 10;
        scoreDiv.textContent = 'Score: ' + score;
    }

    // move ghost randomly
    const dirs = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const ghostNextX = ghost.x + dir.dx;
    const ghostNextY = ghost.y + dir.dy;
    if (board[ghostNextY][ghostNextX] !== 1) {
        ghost.x = ghostNextX;
        ghost.y = ghostNextY;
    }

    // check collision
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        gameOver = true;
        statusDiv.textContent = 'Game Over';
    }

    // check win
    let pelletsLeft = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (board[y][x] === 0) pelletsLeft++;
        }
    }
    if (pelletsLeft === 0) {
        gameOver = true;
        statusDiv.textContent = 'You Win!';
    }
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': pacman.dx = 0; pacman.dy = -1; break;
        case 'ArrowDown': pacman.dx = 0; pacman.dy = 1; break;
        case 'ArrowLeft': pacman.dx = -1; pacman.dy = 0; break;
        case 'ArrowRight': pacman.dx = 1; pacman.dy = 0; break;
    }
});

function loop() {
    update();
    drawBoard();
    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

drawBoard();
requestAnimationFrame(loop);
