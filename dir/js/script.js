// Conway's Game of Life - Premium Edition
// Enhanced UI with controls and themes while preserving original game logic

// Selectors
const container = document.querySelector(".container")

// UI Elements
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const randomBtn = document.getElementById('randomBtn');
const gridSizeSelect = document.getElementById('gridSize');
const speedRange = document.getElementById('speed');
const speedDisplay = document.getElementById('speedDisplay');
const generationSpan = document.getElementById('generation');
const aliveCellsSpan = document.getElementById('aliveCells');
const gameOverlay = document.getElementById('gameOverlay');
const themeButtons = document.querySelectorAll('.theme-btn');
const patternButtons = document.querySelectorAll('.pattern-btn');

// Game State
let isPlaying = false;
let gameInterval = null;
let generation = 0;
let speed = 200;

// Mesh Dimensions (keeping original variables)
let rows = 15;
let cols = 15;

// Mesh BluePrint (keeping original logic)
let mesh = null;

// Initialize theme
document.body.setAttribute('data-theme', 'default');

function initMeshBluePrint(){
    mesh = new Array(rows);
    for (let i = 0; i < rows; i++) {
        mesh[i] = new Array(cols);
    }
}

function populateMeshBluePrint(){
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            mesh[i][j] = 0;
        }
    }
}

// Enhanced UI initialization with click handlers
function initMeshUi() {
    container.innerHTML = ""; // Clear first

    // Set CSS grid layout columns dynamically
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => toggleCell(i));
        container.appendChild(cell);
    }
    
    updateStats();
}

// Toggle cell state on click
function toggleCell(index) {
    const row = Math.floor(index / cols);
    const col = index % cols;
    mesh[row][col] = mesh[row][col] === 0 ? 1 : 0;
    updateMeshUi();
}

function updateMeshUi() {
    let cells = document.querySelectorAll(".cell")
    let counter = 0;
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            if(mesh[i][j] == 0){
                cells[counter++].classList.remove('cell_active')
            }
            if(mesh[i][j] == 1){
                cells[counter++].classList.add('cell_active')
            }
        }
    }
    updateStats();
}

// Update statistics
function updateStats() {
    let aliveCount = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (mesh[i][j] === 1) aliveCount++;
        }
    }
    
    generationSpan.textContent = generation;
    aliveCellsSpan.textContent = aliveCount;
    speedDisplay.textContent = speed + 'ms';
}

// Original Conway's validation logic (unchanged)
function Conways_validation(found_count, cell_x) {
    const isAlive = cell_x === 1;

    if (isAlive) {
        if (found_count < 2 || found_count > 3) return 0;
        if (found_count === 2 || found_count === 3) return 1;
    } else {
        if (found_count === 3) return 1;
    }
    return 0; // Default return
}

// Original game logic (unchanged)
function actual_game() {
    let found = 0;
    let next_mesh = new Array(rows).fill(null).map(() => new Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            found  = 0;

            if(i-1 >= 0 && j-1 >= 0 && mesh[i-1][j-1]){ found++ }
            if(i-1 >= 0 && j >= 0 && mesh[i-1][j]){ found++ }
            if(i-1 >= 0 && j+1 >= 0 && mesh[i-1][j+1]){ found++ }
            if(i >= 0 && j-1 >= 0 && mesh[i][j-1]){ found++ }
            if(i >= 0 && j+1 < cols && mesh[i][j+1]){ found++ }
            if(i+1 < rows && j-1 < cols && mesh[i+1][j-1]){ found++ }
            if(i+1 < rows && j >= 0 && mesh[i+1][j]){ found++ }
            if(i+1 < rows && j+1 < cols && mesh[i+1][j+1]){ found++ }

            next_mesh[i][j] = Conways_validation(found, mesh[i][j])
        }
    }
    
    mesh = next_mesh;
    generation++;
    updateMeshUi();
}

// Enhanced game control functions
function startGame() {
    if (!isPlaying) {
        isPlaying = true;
        gameOverlay.classList.remove('show');
        gameInterval = setInterval(() => {
            actual_game();
        }, speed);
        
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
    }
}

function pauseGame() {
    if (isPlaying) {
        isPlaying = false;
        clearInterval(gameInterval);
        
        playBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
    }
}

function resetGame() {
    pauseGame();
    generation = 0;
    populateMeshBluePrint();
    updateMeshUi();
    gameOverlay.classList.add('show');
}

function randomizeGrid() {
    pauseGame();
    generation = 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            mesh[i][j] = Math.random() < 0.3 ? 1 : 0;
        }
    }
    updateMeshUi();
}

// Pattern insertion functions
function insertPattern(pattern) {
    pauseGame();
    resetGame();
    
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    
    switch(pattern) {
        case 'glider':
            if (centerRow + 2 < rows && centerCol + 2 < cols) {
                mesh[centerRow][centerCol + 1] = 1;
                mesh[centerRow + 1][centerCol + 2] = 1;
                mesh[centerRow + 2][centerCol] = 1;
                mesh[centerRow + 2][centerCol + 1] = 1;
                mesh[centerRow + 2][centerCol + 2] = 1;
            }
            break;
            
        case 'blinker':
            if (centerRow + 1 < rows && centerCol + 1 < cols) {
                mesh[centerRow][centerCol] = 1;
                mesh[centerRow][centerCol + 1] = 1;
                mesh[centerRow][centerCol + 2] = 1;
            }
            break;
            
        case 'toad':
            if (centerRow + 1 < rows && centerCol + 3 < cols) {
                mesh[centerRow][centerCol + 1] = 1;
                mesh[centerRow][centerCol + 2] = 1;
                mesh[centerRow][centerCol + 3] = 1;
                mesh[centerRow + 1][centerCol] = 1;
                mesh[centerRow + 1][centerCol + 1] = 1;
                mesh[centerRow + 1][centerCol + 2] = 1;
            }
            break;
            
        case 'beacon':
            if (centerRow + 3 < rows && centerCol + 3 < cols) {
                mesh[centerRow][centerCol] = 1;
                mesh[centerRow][centerCol + 1] = 1;
                mesh[centerRow + 1][centerCol] = 1;
                mesh[centerRow + 1][centerCol + 1] = 1;
                mesh[centerRow + 2][centerCol + 2] = 1;
                mesh[centerRow + 2][centerCol + 3] = 1;
                mesh[centerRow + 3][centerCol + 2] = 1;
                mesh[centerRow + 3][centerCol + 3] = 1;
            }
            break;
    }
    
    updateMeshUi();
    gameOverlay.classList.remove('show');
}

// Grid size change handler
function changeGridSize(newSize) {
    pauseGame();
    rows = parseInt(newSize);
    cols = parseInt(newSize);
    generation = 0;
    
    initMeshBluePrint();
    populateMeshBluePrint();
    initMeshUi();
    gameOverlay.classList.add('show');
}

// Speed change handler
function changeSpeed(newSpeed) {
    speed = parseInt(newSpeed);
    speedDisplay.textContent = speed + 'ms';
    document.querySelector('.range-value').textContent = speed + 'ms';
    
    if (isPlaying) {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            actual_game();
        }, speed);
    }
}

// Theme change handler
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
}

// Event Listeners
playBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
randomBtn.addEventListener('click', randomizeGrid);

gridSizeSelect.addEventListener('change', (e) => changeGridSize(e.target.value));
speedRange.addEventListener('input', (e) => changeSpeed(e.target.value));

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
});

patternButtons.forEach(btn => {
    btn.addEventListener('click', () => insertPattern(btn.dataset.pattern));
});

// Enhanced initialization function
function run_gol() {
    initMeshBluePrint();
    populateMeshBluePrint();
    initMeshUi();
    
    // Set initial pattern (keeping your original pattern)
    mesh[1][1] = 1;
    mesh[1][4] = 1;
    mesh[2][0] = 1;
    mesh[3][0] = 1;
    mesh[4][0] = 1;
    mesh[4][1] = 1;
    mesh[4][2] = 1;
    mesh[3][3] = 1;
    
    updateMeshUi();
    
    // Initialize UI state
    pauseBtn.style.display = 'none';
    gameOverlay.classList.add('show');
    
    // Set initial speed display
    document.querySelector('.range-value').textContent = speed + 'ms';
}

// Initialize the game
run_gol();
