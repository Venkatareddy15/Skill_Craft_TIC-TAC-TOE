let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let vsComputer = false;
let scores = { X: 0, O: 0 };
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restart');
const twoPlayerButton = document.getElementById('two-player');
const vsComputerButton = document.getElementById('vs-computer');

restartButton.style.display = 'none'; // Hide restart button initially

// Attach event listeners once during initialization
function initializeGame() {
    twoPlayerButton.addEventListener('click', () => startGame(false));
    vsComputerButton.addEventListener('click', () => startGame(true));
    restartButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        startGame();
    });
    startGame(false); // Start the game initially in 2-player mode
}

function startGame(againstComputer) {
    vsComputer = againstComputer;
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    scores = { X: 0, O: 0 }; // Reset scores
    
    let gameModeText = againstComputer ? 'Playing against Computer' : 'Playing 2 Players';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn - ${gameModeText}`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.removeAttribute('data-symbol');
        cell.classList.remove('winning-cell');
        cell.clicked = false; // Reset the clicked flag
        cell.addEventListener('click', handleCellClick);
    });

    // Show/hide difficulty selection based on game mode
    const difficultySelect = document.getElementById('difficultySelect');
    if (vsComputer) {
        if (!difficultySelect) {
            const newDifficultySelect = document.createElement('select');
            newDifficultySelect.id = 'difficultySelect';
            newDifficultySelect.innerHTML = `
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
            `;
            const gameModeDiv = document.querySelector('.game-mode');
            gameModeDiv.appendChild(newDifficultySelect);
        } else if (difficultySelect.style.display === 'none') {
            difficultySelect.style.display = 'inline-block';
        }
    } else {
        if (difficultySelect) {
            difficultySelect.remove();
        }
    }

    restartButton.style.display = 'none'; // Hide restart button at start
    updateScoreTable(); // Update score table
}

// Function to update the score table
function updateScoreTable() {
    let scoreTable = document.getElementById('scoreTable');
    if (!scoreTable) {
        scoreTable = document.createElement('table');
        scoreTable.id = 'scoreTable';
        scoreTable.style.width = '200px'; // Set width
        scoreTable.style.margin = '20px auto'; // Center the table

        let thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Player</th>
                <th>Score</th>
            </tr>
        `;
        scoreTable.appendChild(thead);

        let tbody = document.createElement('tbody');
        tbody.id = 'scoreTableBody';
        scoreTable.appendChild(tbody);

        document.querySelector('.container').insertBefore(scoreTable, document.querySelector('.board'));
    }

    let scoreTableBody = document.getElementById('scoreTableBody');
    scoreTableBody.innerHTML = `
        <tr>
            <td>X</td>
            <td>${scores.X}</td>
        </tr>
        <tr>
            <td>O</td>
            <td>${scores.O}</td>
        </tr>
    `;
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (gameState[cellIndex] !== '' || !gameActive || cell.clicked) return;

    // Set a flag to prevent multiple clicks
    cell.clicked = true;

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.setAttribute('data-symbol', currentPlayer);

    // Force a repaint of the cell
    cell.style.display = 'none';
    cell.offsetHeight;
    cell.style.display = '';

    if (checkWin()) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells();
        gameActive = false;
        restartButton.style.display = 'inline-block'; // Show restart button
		scores[currentPlayer]++; // Update score
        updateScoreTable(); // Update score table
        return;
    }

    if (checkDraw()) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameActive = false;
        restartButton.style.display = 'inline-block'; // Show restart button
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;

    // Add animation class
    statusDisplay.classList.add('fade-in');
    setTimeout(() => {
        statusDisplay.classList.remove('fade-in');
    }, 500);

    // If playing against computer, trigger computer's move
    if (vsComputer && gameActive && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === currentPlayer);
    });
}

function checkDraw() {
    return !gameState.includes('');
}

function highlightWinningCells() {
    for (let condition of winningConditions) {
        if (condition.every(index => gameState[index] === currentPlayer)) {
            condition.forEach(index => cells[index].classList.add('winning-cell'));
            break;
        }
    }
}

function computerMove() {
    const difficulty = document.getElementById('difficultySelect').value;
    let move;

    switch (difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = getBestMove(); // Implement getBestMove for medium difficulty
            break;
        case 'hard':
            move = getBestMove(); // Implement getBestMove for hard difficulty
            break;
        default:
            move = getRandomMove();
    }

    const fakeEvent = {
        target: cells[move]
    };
    handleCellClick(fakeEvent);
}

function getBestMove() {
    // Basic implementation for medium and hard difficulty
    const emptyCells = gameState.reduce((acc, cell, index) => 
        cell === '' ? [...acc, index] : acc, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getRandomMove() {
    const emptyCells = gameState.reduce((acc, cell, index) => 
        cell === '' ? [...acc, index] : acc, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    twoPlayerButton.addEventListener('click', () => startGame(false));
    vsComputerButton.addEventListener('click', () => startGame(true));
    restartButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission
        startGame();
    });
    startGame(false); // Start the game initially in 2-player mode

    // Add footer
    const footer = document.createElement('footer');
    footer.textContent = 'Developed by Venkata Reddy';
    footer.style.textAlign = 'center';
    footer.style.marginTop = '20px';
    document.body.appendChild(footer);
	
	updateScoreTable(); // Initialize score table
});
