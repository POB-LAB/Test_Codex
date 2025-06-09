import { drawBoard, state } from './board.js';
import { update } from './update.js';
import { setupInput } from './input.js';

setupInput();

const SPEED = 2; // lower speed by updating every other frame
let frame = 0;

function loop() {
    frame++;
    if (frame % SPEED === 0) {
        update();
        drawBoard();
    }
    if (!state.gameOver) {
        requestAnimationFrame(loop);
    }
}

drawBoard();
requestAnimationFrame(loop);
