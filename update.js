import { board, state, scoreDiv, statusDiv, width, height } from './board.js';

export function update() {
    if (state.gameOver) return;

    // move pacman
    const nextX = state.pacman.x + state.pacman.dx;
    const nextY = state.pacman.y + state.pacman.dy;
    if (board[nextY][nextX] !== 1) {
        state.pacman.x = nextX;
        state.pacman.y = nextY;
    }
    if (board[state.pacman.y][state.pacman.x] === 0) {
        board[state.pacman.y][state.pacman.x] = 2; // eaten
        state.score += 10;
        scoreDiv.textContent = 'Score: ' + state.score;
    }

    // move ghosts randomly
    const dirs = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];
    for (const g of state.ghosts) {
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const ghostNextX = g.x + dir.dx;
        const ghostNextY = g.y + dir.dy;
        if (board[ghostNextY][ghostNextX] !== 1) {
            g.x = ghostNextX;
            g.y = ghostNextY;
        }
    }

    // check collision
    for (const g of state.ghosts) {
        if (state.pacman.x === g.x && state.pacman.y === g.y) {
            state.gameOver = true;
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
        state.gameOver = true;
        statusDiv.textContent = 'You Win!';
    }
}
