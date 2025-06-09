import { state } from './board.js';

export function setupInput() {
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                state.pacman.dx = 0; state.pacman.dy = -1; break;
            case 'ArrowDown':
                state.pacman.dx = 0; state.pacman.dy = 1; break;
            case 'ArrowLeft':
                state.pacman.dx = -1; state.pacman.dy = 0; break;
            case 'ArrowRight':
                state.pacman.dx = 1; state.pacman.dy = 0; break;
        }
    });
}
