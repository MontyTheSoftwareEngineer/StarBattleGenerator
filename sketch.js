const rows = 15;
const cols = 15;
const cellSize = 40;
const seed = 12346;
const starDifficulty = 3;
let gameboard;

function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  gameboard = new GameBoard(rows, cols, cellSize, seed, starDifficulty);
}

function draw() {
  background(220);
  gameboard.draw();
  // Draw all cells
}

function mousePressed() {
  gameboard.nextIteration();
}
