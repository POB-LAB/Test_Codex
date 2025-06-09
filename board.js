export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const tileSize = 20;
export const width = canvas.width / tileSize;
export const height = canvas.height / tileSize;

export const scoreDiv = document.getElementById('score');
export const statusDiv = document.getElementById('status');

export const state = {
    score: 0,
    gameOver: false,
    pacman: { x: 1, y: 1, dx: 0, dy: 0 },
    ghosts: [
        { x: width - 2, y: height - 2, dx: 0, dy: 0, color: 'red' },
        { x: width - 2, y: 1, dx: 0, dy: 0, color: 'pink' },
        { x: 1, y: height - 2, dx: 0, dy: 0, color: 'cyan' }
    ]
};

export const board = [];
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

export function drawBoard() {
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
    ctx.arc(state.pacman.x * tileSize + tileSize / 2, state.pacman.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.lineTo(state.pacman.x * tileSize + tileSize / 2, state.pacman.y * tileSize + tileSize / 2);
    ctx.fill();

    // draw ghosts
    for (const g of state.ghosts) {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x * tileSize + tileSize / 2, g.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}
