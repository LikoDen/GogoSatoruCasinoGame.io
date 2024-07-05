document.addEventListener('DOMContentLoaded', () => {
    let balance = 1000;
    const balanceElement = document.getElementById('balance');
    const betAmountElement = document.getElementById('betAmount');
    const riskLevelElement = document.getElementById('riskLevel');
    const gameBoardElement = document.getElementById('gameBoard');
    const gameStatusElement = document.getElementById('gameStatus');
    const startGameButton = document.getElementById('startGame');
    const collectWinningsButton = document.getElementById('collectWinnings');
    const resetGameButton = document.getElementById('resetGame');

    let gameActive = false;
    let cells = [];
    let winnings = 0;

    startGameButton.addEventListener('click', startGame);
    collectWinningsButton.addEventListener('click', collectWinnings);
    resetGameButton.addEventListener('click', resetGame);

    function startGame() {
        const betAmount = parseInt(betAmountElement.value);
        const riskLevel = parseInt(riskLevelElement.value);
    
        if (betAmount > balance) {
            alert('Insufficient balance.');
            return;
        }
    
        balance -= betAmount;
        balanceElement.textContent = balance;
        winnings = 0;
        gameActive = true;
        gameStatusElement.textContent = '';
        generateGameBoard(riskLevel);
        animateGameStart();
    }
    
    function animateGameStart() {
        cells.forEach(cell => {
            cell.style.animation = 'none';
            void cell.offsetWidth; // Trigger reflow to restart animation
            cell.style.animation = `reveal 0.3s ease forwards`;
        });
    }
    
    function generateGameBoard(riskLevel) {
        gameBoardElement.innerHTML = '';
        cells = [];
        const rows = 5;
        const cols = 5;
        const totalCells = rows * cols;
        const totalMines = Math.floor((riskLevel / 3) * totalCells);

        let minePositions = new Set();
        while (minePositions.size < totalMines) {
            minePositions.add(Math.floor(Math.random() * totalCells));
        }

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.dataset.isMine = minePositions.has(i) ? 'true' : 'false'; // Store whether the cell is a mine
            cell.addEventListener('click', onCellClick);
            cells.push(cell);
            gameBoardElement.appendChild(cell);
        }
    }

    function onCellClick(event) {
        if (!gameActive) return;

        const cell = event.target;
        if (cell.dataset.isMine === 'true') {
            cell.classList.add('mine');
            cell.style.animation = 'explode 0.5s ease-out forwards';
            gameStatusElement.textContent = 'Game Over! You hit a mine!';
            gameActive = false;
        } else {
            cell.classList.add('safe');
            cell.style.animation = 'reveal 0.3s ease forwards';
            
            // Увеличиваем выигрыши в зависимости от уровня риска
            const riskLevel = parseInt(riskLevelElement.value);
            winnings += parseInt(betAmountElement.value) * riskLevel;
    
            // Обновляем баланс и статус игры
            balance += parseInt(betAmountElement.value) * riskLevel;
            balanceElement.textContent = balance;
            gameStatusElement.textContent = `You won ${parseInt(betAmountElement.value) * riskLevel}!`;
        }
    }

    function collectWinnings() {
        if (!gameActive) {
            alert('No active game to collect winnings from.');
            return;
        }

        balance += winnings;
        balanceElement.textContent = balance;
        gameStatusElement.textContent = `You collected ${winnings} winnings!`;
        gameActive = false;
    }

    function resetGame() {
        gameActive = false;
        winnings = 0;
        balance = 1000;
        balanceElement.textContent = balance;
        gameBoardElement.innerHTML = '';
        gameStatusElement.textContent = '';
    }
});
