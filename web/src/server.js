const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

// Serve static frontend
app.use('/', express.static(path.join(__dirname, '..', 'public')));

function validGrid(grid) {
  if (!Array.isArray(grid) || grid.length !== 9) return false;
  for (let r = 0; r < 9; r++) {
    if (!Array.isArray(grid[r]) || grid[r].length !== 9) return false;
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c];
      if (typeof v !== 'number' || v < 0 || v > 9) return false;
    }
  }
  return true;
}

function findEmpty(grid) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (grid[r][c] === 0) return [r, c];
  return null;
}

function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++) if (grid[row][x] === num) return false;
  for (let x = 0; x < 9; x++) if (grid[x][col] === num) return false;
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (grid[startRow + r][startCol + c] === num) return false;
  return true;
}

function solveGrid(grid) {
  const empty = findEmpty(grid);
  if (!empty) return true;
  const [row, col] = empty;
  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveGrid(grid)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
}

function deepClone(grid) {
  return grid.map(r => r.slice());
}

function generateSolution() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  function fillGrid() {
    const empty = findEmpty(grid);
    if (!empty) return true;
    const [row, col] = empty;
    const nums = [1,2,3,4,5,6,7,8,9];
    shuffle(nums);
    for (const num of nums) {
      if (isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (fillGrid()) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  fillGrid();
  return grid;
}

function generatePuzzle(removeCount = 40) {
  const solution = generateSolution();
  const puzzle = deepClone(solution);
  let removed = 0;
  const cells = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r,c]);
  while (removed < removeCount && cells.length) {
    const idx = Math.floor(Math.random() * cells.length);
    const [r,c] = cells.splice(idx,1)[0];
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }
  return { puzzle, solution };
}

app.post('/solve', (req, res) => {
  const grid = req.body.grid;
  if (!validGrid(grid)) return res.status(400).json({ error: 'grid must be 9x9 numbers 0-9' });
  const clone = deepClone(grid);
  const ok = solveGrid(clone);
  if (!ok) return res.status(422).json({ error: 'unsolvable' });
  res.json({ solution: clone });
});

app.post('/generate', (req, res) => {
  const remove = parseInt(req.query.remove || req.body.remove || 40, 10);
  const r = Math.max(0, Math.min(80, remove));
  const { puzzle, solution } = generatePuzzle(r);
  res.json({ puzzle, solution });
});

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Sudoku web server listening on ${port}`));
