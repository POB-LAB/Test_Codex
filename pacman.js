const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 20;
const width = canvas.width / tileSize;
const height = canvas.height / tileSize;

let score = 0;
let gameOver = false;

const scoreDiv = document.getElementById('score');
const statusDiv = document.getElementById('status');

let board = [];

function buildBoard() {
    board = [];
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

    // add simple maze walls
    for (let y = 2; y < height - 2; y += 4) {
        for (let x = 2; x < width - 2; x++) {
            if (x % 5 !== 0) {
                board[y][x] = 1;
            }
        }
    }

    for (let x = 2; x < width - 2; x += 4) {
        for (let y = 2; y < height - 2; y++) {
            if (y % 5 !== 0) {
                board[y][x] = 1;
            }
        }
    }
}

const pacman = { x: 1, y: 1, dx: 0, dy: 0 };
const ghosts = [
    { x: width - 2, y: height - 2, dx: 0, dy: 0, color: 'red' },
    { x: width - 2, y: 1, dx: 0, dy: 0, color: 'pink' },
    { x: 1, y: height - 2, dx: 0, dy: 0, color: 'cyan' }
];

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

    // draw ghosts
    for (const g of ghosts) {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x * tileSize + tileSize / 2, g.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, 2 * Math.PI);
        ctx.fill();
    }
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

    // move ghosts randomly
    const dirs = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];
    for (const g of ghosts) {
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const ghostNextX = g.x + dir.dx;
        const ghostNextY = g.y + dir.dy;
        if (board[ghostNextY][ghostNextX] !== 1) {
            g.x = ghostNextX;
            g.y = ghostNextY;
        }
    }

    // check collision
    for (const g of ghosts) {
        if (pacman.x === g.x && pacman.y === g.y) {
            gameOver = true;
            statusDiv.textContent = 'Game Over';
        }
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

document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    }
});

document.getElementById('restartBtn').addEventListener('click', resetGame);

const SPEED = 2; // lower speed by updating every other frame
let frame = 0;

function loop() {
    frame++;
    if (frame % SPEED === 0) {
        update();
        drawBoard();
    }
    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

function resetGhosts() {
    ghosts[0].x = width - 2; ghosts[0].y = height - 2;
    ghosts[1].x = width - 2; ghosts[1].y = 1;
    ghosts[2].x = 1; ghosts[2].y = height - 2;
}

function resetGame() {
    score = 0;
    gameOver = false;
    pacman.x = 1; pacman.y = 1; pacman.dx = 0; pacman.dy = 0;
    resetGhosts();
    buildBoard();
    scoreDiv.textContent = 'Score: ' + score;
    statusDiv.textContent = '';
    frame = 0;
    drawBoard();
    requestAnimationFrame(loop);
}

buildBoard();
drawBoard();
requestAnimationFrame(loop);
