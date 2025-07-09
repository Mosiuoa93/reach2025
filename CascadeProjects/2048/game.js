class Game2048 {
    constructor() {
        this.grid = document.querySelector('.grid-container');
        this.scoreContainer = document.querySelector('.score-container');
        this.bestContainer = document.querySelector('.best-container');
        this.restartButton = document.querySelector('.restart-button');
        
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.gameOver = false;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.cells = Array.from(document.querySelectorAll('.grid-cell'));
        this.setupTiles();
        this.addRandomTile();
        this.addRandomTile();
        this.updateScore();
        this.updateBestScore();
    }

    setupTiles() {
        this.cells.forEach(cell => {
            cell.innerHTML = '';
        });
    }

    addRandomTile() {
        if (this.isGameOver()) return;

        const emptyCells = this.cells.filter(cell => !cell.querySelector('.tile'));
        if (emptyCells.length === 0) return;

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}`;
        tile.textContent = value;
        
        const cellPosition = this.getCellPosition(randomCell);
        tile.style.left = `${cellPosition.x}px`;
        tile.style.top = `${cellPosition.y}px`;
        
        randomCell.appendChild(tile);
    }

    getCellPosition(cell) {
        const cellRect = cell.getBoundingClientRect();
        const containerRect = this.grid.getBoundingClientRect();
        return {
            x: cellRect.left - containerRect.left,
            y: cellRect.top - containerRect.top
        };
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    handleKeyPress(e) {
        if (this.gameOver) return;

        const moves = {
            ArrowUp: () => this.moveUp(),
            ArrowDown: () => this.moveDown(),
            ArrowLeft: () => this.moveLeft(),
            ArrowRight: () => this.moveRight()
        };

        if (moves[e.key]) {
            e.preventDefault();
            moves[e.key]();
        }
    }

    moveUp() {
        this.move('up');
    }

    moveDown() {
        this.move('down');
    }

    moveLeft() {
        this.move('left');
    }

    moveRight() {
        this.move('right');
    }

    move(direction) {
        let moved = false;
        
        // Create a copy of the grid to track changes
        const gridCopy = [...this.cells];
        
        // Move tiles
        this.cells.forEach(cell => {
            const tile = cell.querySelector('.tile');
            if (tile) {
                const newPosition = this.calculateNewPosition(cell, direction);
                if (newPosition) {
                    const targetCell = this.cells.find(c => 
                        this.getCellPosition(c).x === newPosition.x &&
                        this.getCellPosition(c).y === newPosition.y
                    );
                    
                    if (targetCell) {
                        const targetTile = targetCell.querySelector('.tile');
                        if (targetTile) {
                            // Merge tiles if they have the same value
                            if (tile.textContent === targetTile.textContent) {
                                const newValue = parseInt(tile.textContent) * 2;
                                targetTile.textContent = newValue;
                                targetTile.className = `tile tile-${newValue}`;
                                this.score += newValue;
                                tile.remove();
                                moved = true;
                            }
                        } else {
                            // Move tile to new position
                            targetCell.appendChild(tile);
                            tile.style.left = `${newPosition.x}px`;
                            tile.style.top = `${newPosition.y}px`;
                            moved = true;
                        }
                    }
                }
            }
        });

        // Add new tile if any tiles moved
        if (moved) {
            this.addRandomTile();
            this.updateScore();
            this.checkGameOver();
        }
    }

    calculateNewPosition(cell, direction) {
        const currentPosition = this.getCellPosition(cell);
        const gridSize = 4;
        const cellSize = 106.25;
        const spacing = 15;
        
        let newPosition = { x: currentPosition.x, y: currentPosition.y };
        
        // Calculate new position based on direction
        switch(direction) {
            case 'up':
                newPosition.y = Math.max(0, newPosition.y - cellSize - spacing);
                break;
            case 'down':
                newPosition.y = Math.min(3 * (cellSize + spacing), newPosition.y + cellSize + spacing);
                break;
            case 'left':
                newPosition.x = Math.max(0, newPosition.x - cellSize - spacing);
                break;
            case 'right':
                newPosition.x = Math.min(3 * (cellSize + spacing), newPosition.x + cellSize + spacing);
                break;
        }
        
        // Check if new position is valid
        const targetCell = this.cells.find(c => 
            this.getCellPosition(c).x === newPosition.x &&
            this.getCellPosition(c).y === newPosition.y
        );
        
        if (targetCell && !targetCell.querySelector('.tile')) {
            return newPosition;
        }
        
        return null;
    }

    updateScore() {
        this.scoreContainer.textContent = this.score;
        this.bestScore = Math.max(this.score, this.bestScore);
        localStorage.setItem('bestScore', this.bestScore);
        this.bestContainer.textContent = this.bestScore;
    }

    updateBestScore() {
        this.bestContainer.textContent = this.bestScore;
    }

    checkGameOver() {
        if (this.isGameOver()) {
            alert('Game Over!');
            this.gameOver = true;
        }
    }

    isGameOver() {
        // Check if there are any empty cells
        if (this.cells.some(cell => !cell.querySelector('.tile'))) return false;

        // Check if any adjacent cells can be merged
        for (let i = 0; i < this.cells.length; i++) {
            const tile = this.cells[i].querySelector('.tile');
            if (tile) {
                const currentPosition = this.getCellPosition(this.cells[i]);
                
                // Check up, down, left, right
                const directions = [
                    { x: 0, y: -111.25 }, // up
                    { x: 0, y: 111.25 },  // down
                    { x: -111.25, y: 0 }, // left
                    { x: 111.25, y: 0 }   // right
                ];

                for (const dir of directions) {
                    const neighborPosition = {
                        x: currentPosition.x + dir.x,
                        y: currentPosition.y + dir.y
                    };

                    const neighborCell = this.cells.find(c => 
                        this.getCellPosition(c).x === neighborPosition.x &&
                        this.getCellPosition(c).y === neighborPosition.y
                    );

                    if (neighborCell) {
                        const neighborTile = neighborCell.querySelector('.tile');
                        if (neighborTile && neighborTile.textContent === tile.textContent) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    restartGame() {
        this.score = 0;
        this.gameOver = false;
        this.setupTiles();
        this.addRandomTile();
        this.addRandomTile();
        this.updateScore();
    }
}

// Initialize the game
new Game2048();
